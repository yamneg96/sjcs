import { GoogleGenAI } from "@google/genai";
import VectorDocument from "./vector-document.model";
import { chunkText } from "./rag.utils";
import { env } from "../../config/env";
import pdfParse from "pdf-parse";
import OpenAI from "openai";
import Groq from "groq-sdk";

// Initialize AI Clients
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY || "dummy" });
const groq = new Groq({ apiKey: env.GROQ_API_KEY || "dummy" });

export class RAGService {
  /**
   * Generates embeddings with fallback logic to prevent server crashes.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    // Current 2026 stable embedding models on Groq
    const embeddingModels = [
      "nomic-embed-text-v1_5", 
      "snowflake-arctic-embed-m-v2.0"
    ];

    for (const modelId of embeddingModels) {
      try {
        const groqResponse: any = await (groq as any).embeddings?.create({
          input: text,
          model: modelId, 
        });

        if (groqResponse?.data?.[0]?.embedding) {
          return groqResponse.data[0].embedding;
        }
      } catch (error: any) {
        console.warn(`Embedding model ${modelId} failed. Trying next...`, error.message);
        continue;
      }
    }

    // Final Fallback: Returns a dummy 768-dim vector to prevent 500 errors in Mongo
    console.error("CRITICAL: All embedding models failed. Using dummy vector.");
    return new Array(768).fill(0.01);
  }

  /**
   * Generates a text answer with automatic fallback for decommissioned models.
   * Replaces the decommissioned 'llama3-8b-8192'.
   */
  static async generateAnswer(prompt: string): Promise<string> {
    // Active 2026 Groq Models (ordered by preference)
    const chatModels = [
      "llama-3.1-8b-instant",      // Primary replacement (Fast/Reliable)
      "llama-3.3-70b-versatile",   // Higher reasoning
      "openai/gpt-oss-120b",       // Large 131k context window
      "qwen/qwen3-32b"             // Multilingual backup
    ];

    for (const modelId of chatModels) {
      try {
        console.log(`Prompting Groq with model: ${modelId}...`);
        const groqResponse = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: modelId,
        });

        const content = groqResponse.choices[0]?.message?.content;
        if (content) return content;

      } catch (error: any) {
        // Handle decommissioned (400) or rate limits (429) by switching models
        if (error.status === 400 || error.status === 429) {
          console.warn(`Model ${modelId} failed/decommissioned. Switching...`);
          continue; 
        }
        
        console.error(`Unexpected error with ${modelId}:`, error);
        break; 
      }
    }

    throw new Error("RAG Error: All Groq chat models failed or are decommissioned.");
  }

  /**
   * Ingests a PDF buffer, extracts text, chunks it, embeds it, and saves to MongoDB.
   */
  static async ingestPDF(
    fileBuffer: Buffer,
    subject: string,
    grade: number,
    type: "public" | "learning",
    sourceFile?: string
  ): Promise<number> {
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;
    const chunks = chunkText(text);

    const documents = [];
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;

      const embedding = await this.generateEmbedding(chunk);

      documents.push({
        content: chunk,
        embedding,
        subject,
        grade,
        type,
        sourceFile,
      });
    }

    if (documents.length > 0) {
      await VectorDocument.insertMany(documents);
    }
    
    return documents.length;
  }

  /**
   * Find similar documents using MongoDB vector search with basic fallback.
   */
  static async findRelevantContext(
    query: string,
    accessibleGrades: number[],
    subject?: string,
    limit: number = 5
  ) {
    const queryEmbedding = await this.generateEmbedding(query);

    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: "vector_index", 
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: limit,
          filter: {
            grade: { $in: accessibleGrades },
            ...(subject ? { subject } : {})
          }
        }
      },
      {
        $project: {
          content: 1,
          subject: 1,
          grade: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    try {
      const results = await VectorDocument.aggregate(pipeline);
      return results;
    } catch (error) {
       console.warn("Vector search failed. Falling back to basic text retrieval.", error);
       const fallback = await VectorDocument.find({
          grade: { $in: accessibleGrades },
          ...(subject ? { subject } : {})
       }).limit(limit).lean();
       return fallback;
    }
  }
}

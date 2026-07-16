import mongoose from "mongoose";
import VectorDocument, { IVectorDocument } from "./vector-document.model";
import { chunkText } from "./rag.utils";
import pdfParse from "pdf-parse";
import { AIGateway } from "../ai/ai.gateway";

/**
 * Materials RAG ingestion/retrieval pipeline (§24.4). Embeddings route
 * exclusively through AIGateway.generateEmbedding() — this module never
 * instantiates a provider SDK directly (CLAUDE.md: "Backend modules call
 * AIGateway only").
 */
export class RAGService {
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

      const { embedding } = await AIGateway.generateEmbedding(chunk);

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
    const { embedding: queryEmbedding } = await AIGateway.generateEmbedding(query);

    const pipeline: mongoose.PipelineStage[] = [
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
      } as any, // Mongoose PipelineStage doesn't natively type $vectorSearch in older mongoose models, cast to any is safe here
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
       return fallback as unknown as IVectorDocument[];
    }
  }
}

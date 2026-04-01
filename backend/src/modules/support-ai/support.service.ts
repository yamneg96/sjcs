import { SupportDoc } from "./support-rag.model";
import { RAGService } from "../rag/rag.service";

export const askSupportAI = async (question: string) => {
  // 1. Embed question using standardized RAG utility
  const queryEmbedding = await RAGService.generateEmbedding(question);

  // 2. Fetch all support docs (Support set is usually small enough for simple in-memory or basic filter)
  // In a production app, we would use Atlas Vector Search here too.
  // For now, let's try a basic retrieval or Atlas if index exists.
  let context = "";
  try {
     const docs = await SupportDoc.aggregate([
       {
         $vectorSearch: {
           index: "support_vector_index",
           path: "embedding",
           queryVector: queryEmbedding,
           numCandidates: 10,
           limit: 5
         }
       }
     ]);
     context = docs.map(d => d.content).join("\n\n");
  } catch (err) {
     console.warn("Support vector search failed, falling back to basic retrieval.");
     const fallbackDocs = await SupportDoc.find().limit(5);
     context = fallbackDocs.map(d => d.content).join("\n\n");
  }

  // 3. AI prompt
  const prompt = `
You are the Saint Joseph Catholic School (SJCS) Digital Assistant. 
Your goal is to help parents, students, and visitors with general information about the school.

Context from SJCS Handbook/Website:
${context}

User Question: ${question}

Rules:
- Be polite, professional, and helpful.
- If the answer isn't in the context, say: "I'm sorry, I don't have that specific information right now. Please contact the school office at office@sjcs.edu for further assistance."
- Maintain the Catholic identity of the school in your tone.
`;

  return RAGService.generateAnswer(prompt);
};
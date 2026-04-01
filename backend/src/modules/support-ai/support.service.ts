// export const askSupportAI = async (question: string) => {
//   // 1. Embed question
//   const queryEmbedding = await embedText(question);

//   // 2. Fetch docs (no grade filter)
//   const docs = await SupportDoc.find().limit(200);

//   // 3. Similarity search (you can reuse your cosine logic)
//   const relevantDocs = findSimilar(docs, queryEmbedding);

//   // 4. Build context
//   const context = relevantDocs.map(d => d.content).join("\n");

//   // 5. AI prompt
//   const prompt = `
// You are an SJCS school assistant.

// Answer clearly and professionally.

// Context:
// ${context}

// Question:
// ${question}

// Rules:
// - Be concise
// - Be accurate
// - If unknown, say "Please contact the school office"
// `;

//   return askAI(prompt);
// };
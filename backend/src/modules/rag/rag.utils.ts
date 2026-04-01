import crypto from "crypto";

export const chunkText = (text: string) => {
  // Normalize whitespace to prevent weird chunking
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const words = normalizedText.split(" ");
  const size = 300;
  const overlap = 50;
  const chunks = [];

  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(" "));
  }

  return chunks;
};

export const hashFile = (content: string | Buffer): string => {
  return crypto.createHash("sha256").update(content).digest("hex");
};

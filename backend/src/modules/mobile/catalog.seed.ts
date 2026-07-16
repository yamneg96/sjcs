import ModelCatalogEntry from "./model-catalog.model";

/**
 * Bootstraps the model catalog with a default entry the first time the
 * platform runs. Per ADR-003 this is DATA, not architecture: the entry below
 * happens to be a Bonsai-derived 2B chat model today; replacing it (or adding
 * a Gemma Nano variant tomorrow) is a catalog edit through the super-admin
 * portal — never a code change.
 *
 * NOTE on checksums: the client verifies `md5:<hex>` via the device file
 * system before a model can reach the REGISTERING state. Placeholder values
 * below must be replaced when real artifacts are uploaded to R2
 * (`lumora-models/models/<modelId>/<version>/...`).
 */
export async function ensureModelCatalogSeeded(): Promise<void> {
  const count = await ModelCatalogEntry.estimatedDocumentCount();
  if (count > 0) return;

  await ModelCatalogEntry.create({
    modelId: "chat-2b",
    displayName: "Lumora Chat 2B",
    description:
      "On-device tutor model (2B parameters, 4-bit). Chat, quizzes, summaries and flashcards — fully offline.",
    engine: "executorch",
    task: "chat",
    capabilities: ["chat", "quiz", "summary", "flashcards", "translation"],
    sizeBytes: 996_147_200, // ~950 MB
    quantization: "4bit",
    minimumRAMGB: 6,
    languages: ["English", "Amharic"],
    downloadUrl:
      process.env.MODEL_CHAT2B_URL ||
      "https://models.lumora.example/models/chat-2b/2.0/model.pte",
    tokenizerUrl:
      process.env.MODEL_CHAT2B_TOKENIZER_URL ||
      "https://models.lumora.example/models/chat-2b/2.0/tokenizer.json",
    tokenizerConfigUrl:
      process.env.MODEL_CHAT2B_TOKENIZER_CONFIG_URL ||
      "https://models.lumora.example/models/chat-2b/2.0/tokenizer_config.json",
    checksum: process.env.MODEL_CHAT2B_CHECKSUM || "md5:REPLACE_ON_UPLOAD",
    version: "2.0",
    status: "stable",
    compat: { minAppVersion: "1.0.0", abis: ["arm64-v8a"] },
  });

  console.log("📦 Model catalog seeded with default entry (chat-2b v2.0)");
}

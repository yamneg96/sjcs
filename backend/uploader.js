import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import dotenv from "dotenv";

// CRITICAL: Load environmental variables from your .env file
dotenv.config();

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://85f55da92fca8eb9f25791c59075e200.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadLargeModel(fileName) {
  // Ensure the file actually exists before starting
  if (!fs.existsSync(`./${fileName}`)) {
    console.error(`Error: File ./${fileName} not found. Skipping.`);
    return;
  }

  const fileStream = fs.createReadStream(`./${fileName}`);

  const parallelUpload = new Upload({
    client: s3,
    params: {
      Bucket: "bonsai-ai-models",
      Key: fileName,
      Body: fileStream,
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5, 
  });

  parallelUpload.on("httpUploadProgress", (progress) => {
    const percentage = Math.round((progress.loaded / progress.total) * 100);
    console.log(`Uploading ${fileName}: ${percentage}% complete`);
  });

  try {
    console.log(`\nStarting upload for ${fileName}...`);
    await parallelUpload.done();
    console.log(`Successfully uploaded ${fileName}!`);
  } catch (err) {
    console.error(`Upload failed for ${fileName}:`, err);
  }
}

// Main function to process files one after the other
async function uploadAllModels() {
  // Replace these exact strings with your real downloaded file names if they differ
  const modelsToUpload = [
    // "Bonsai-1.7B.gguf",
    // "Bonsai-4B.gguf",
    "Bonsai-8B.gguf"
  ];

  for (const model of modelsToUpload) {
    await uploadLargeModel(model);
  }
  console.log("\n All model processing jobs finished!");
}

uploadAllModels();

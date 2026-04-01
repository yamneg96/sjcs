import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env";
import { RAGService } from "../rag/rag.service";
import Material from "./material.model";
import { hashFile } from "../rag/rag.utils";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class MaterialsService {
  static async uploadMaterial(
    fileBuffer: Buffer,
    title: string,
    subject: string,
    grade: number,
    type: "ebook" | "worksheet" | "exam",
    description?: string
  ) {
    // 1. Prevent duplicate uploads
    const fileHash = hashFile(fileBuffer);
    const existingMaterial = await Material.findOne({ fileHash });
    if (existingMaterial) {
      throw new Error("Duplicate material detected based on content hash.");
    }

    // 2. Upload to Cloudinary
    const fileUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", format: "pdf" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error", error);
            reject(new Error("Failed to upload file to Cloudinary"));
          } else {
            resolve(result!.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });

    // 3. Save to MongoDB Database
    const material = await Material.create({
      title,
      subject,
      grade,
      type,
      fileUrl,
      description,
      fileHash,
    });

    // 4. Send to RAG ingestion
    await RAGService.ingestPDF(
      fileBuffer,
      subject,
      grade,
      "learning",
      fileUrl
    );

    return material;
  }
}

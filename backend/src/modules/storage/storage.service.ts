import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env";
import { BadRequestError } from "../../shared/errors/errors";

// Configure Cloudinary
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export class StorageService {
  /**
   * Uploads a file buffer directly to Cloudinary, isolated by tenant folders.
   */
  static async uploadBuffer(tenantId: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    if (!env.CLOUDINARY_CLOUD_NAME) {
      // In development / dev-fallback without keys, return a mock URL
      console.warn("Cloudinary not configured. Returning mock storage asset URL.");
      return `https://storage.lumora.app/mock-tenant-${tenantId}/${Date.now()}-${fileName}`;
    }

    return new Promise((resolve, reject) => {
      const folderName = `lumora/${tenantId}`;
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          public_id: `${Date.now()}-${fileName.split(".")[0]}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed :", error);
            return reject(new BadRequestError("Asset upload to cloud storage failed"));
          }
          resolve(result?.secure_url || "");
        }
      );

      uploadStream.end(fileBuffer);
    });
  }
}

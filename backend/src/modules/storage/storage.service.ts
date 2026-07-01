import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env";
import { BadRequestError } from "../../shared/errors/errors";

/**
 * Cloudflare R2 Storage Service (S3-compatible).
 * Supports two buckets:
 *   - Public:  Course materials accessible by authenticated students
 *   - Private: Admission documents (transcripts, IDs) — accessible only via signed URLs
 */
export class StorageService {
  private static client: S3Client | null = null;

  private static getClient(): S3Client {
    if (this.client) return this.client;

    if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
      throw new BadRequestError("R2 storage credentials not configured");
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    return this.client;
  }

  /**
   * Generates a tenant-scoped storage key.
   */
  private static buildKey(tenantId: string, folder: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `organizations/${tenantId}/${folder}/${timestamp}-${sanitized}`;
  }

  /**
   * Upload a file to the PUBLIC R2 bucket (course materials).
   * Returns the publicly accessible URL.
   */
  static async uploadPublic(
    tenantId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<{ fileUrl: string; storageKey: string }> {
    // Dev fallback when R2 is not configured
    if (!env.R2_ACCOUNT_ID) {
      const storageKey = this.buildKey(tenantId, "materials", fileName);
      console.warn("[StorageService] R2 not configured. Returning mock URL.");
      return {
        fileUrl: `https://storage.lumora.app/mock/${storageKey}`,
        storageKey,
      };
    }

    const storageKey = this.buildKey(tenantId, "materials", fileName);
    const client = this.getClient();

    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_PUBLIC,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );

    // Construct public URL (custom domain or R2 default)
    const baseUrl = env.R2_PUBLIC_URL || `https://${env.R2_BUCKET_PUBLIC}.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const fileUrl = `${baseUrl}/${storageKey}`;

    return { fileUrl, storageKey };
  }

  /**
   * Upload a file to the PRIVATE R2 bucket (admission documents, sensitive files).
   * Returns the storage key — access is only via signed URLs.
   */
  static async uploadPrivate(
    tenantId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = "admissions"
  ): Promise<{ storageKey: string }> {
    // Dev fallback
    if (!env.R2_ACCOUNT_ID) {
      const storageKey = this.buildKey(tenantId, folder, fileName);
      console.warn("[StorageService] R2 not configured. Returning mock private key.");
      return { storageKey };
    }

    const storageKey = this.buildKey(tenantId, folder, fileName);
    const client = this.getClient();

    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_PRIVATE,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );

    return { storageKey };
  }

  /**
   * Generates a temporary signed URL for accessing private bucket objects.
   * Default expiry: 15 minutes.
   */
  static async getSignedUrl(storageKey: string, expiresInSeconds: number = 900): Promise<string> {
    if (!env.R2_ACCOUNT_ID) {
      return `https://storage.lumora.app/mock-signed/${storageKey}?expires=${expiresInSeconds}`;
    }

    const client = this.getClient();
    const command = new GetObjectCommand({
      Bucket: env.R2_BUCKET_PRIVATE,
      Key: storageKey,
    });

    return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  }
}

import { Router, Response } from "express";
import multer from "multer";
import { StorageService } from "./storage.service";
import { protect } from "../../middleware/auth.middleware";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { BadRequestError } from "../../shared/errors/errors";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.use(protect);

/**
 * Upload a file to the Public bucket (available to logged-in students/teachers).
 */
router.post(
  "/upload/public",
  upload.single("file"),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new BadRequestError("Auth tenant context required");
      }

      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      const result = await StorageService.uploadPublic(
        tenantId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      sendSuccess(res, result, "File uploaded to public storage");
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Upload a file to the Private bucket (admissions transcripts/docs).
 */
router.post(
  "/upload/private",
  upload.single("file"),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new BadRequestError("Auth tenant context required");
      }

      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      const result = await StorageService.uploadPrivate(
        tenantId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Generate a quick pre-signed URL so the uploader can immediately preview/access it
      const signedUrl = await StorageService.getSignedUrl(result.storageKey);

      sendSuccess(
        res,
        {
          storageKey: result.storageKey,
          fileUrl: signedUrl,
        },
        "File uploaded to private storage"
      );
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Retrieve a signed URL for a private storage key.
 */
router.get("/presigned", async (req: AuthRequest, res: Response, next) => {
  try {
    const { key } = req.query;
    if (!key) {
      throw new BadRequestError("File key is required");
    }

    const signedUrl = await StorageService.getSignedUrl(key as string);
    sendSuccess(res, { url: signedUrl }, "Temporary link generated");
  } catch (err) {
    next(err);
  }
});

export default router;

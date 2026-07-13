import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { configureCloudinary } from "@/lib/cloudinary";
import type { MediaUploadResponse } from "@/types/iot";

/**
 * POST /api/iot/media/upload
 *
 * Menerima file gambar (JPG) dari Orange Pi via multipart form-data,
 * mengunggahnya ke Cloudinary, dan mengembalikan URL permanen.
 * Orange Pi kemudian menyertakan URL ini di payload /api/iot/gerakan.
 */
export async function POST(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    // 2. Parse body sebagai FormData (binary file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // 3. Convert File ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload ke Cloudinary
    const cloudinary = configureCloudinary();

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "gema_imam_poses", // Folder di dashboard Cloudinary
          format: "jpg",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload result is undefined"));
        }
      ).end(buffer);
    });

    // 5. Return URL Cloudinary
    const response: MediaUploadResponse = {
      success: true,
      url: uploadResult.secure_url,
    };

    console.log(`[API] Foto pose berhasil diunggah: ${uploadResult.secure_url}`);
    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /media/upload] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

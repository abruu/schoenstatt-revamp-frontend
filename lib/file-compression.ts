/**
 * Client-side file compression utilities.
 *
 * Compresses images (via browser-image-compression) and PDFs
 * (via pdf-lib + pdfjs-dist rasterisation) to meet target sizes
 * while preserving text, QR code, and signature readability.
 */

import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";

// ─── Errors ──────────────────────────────────────────────────────────────────

/** Thrown when a file cannot be compressed to the target size at acceptable quality. */
export class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressionError";
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMB(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb} MB`;
}

/** Replace the extension of `originalName` to match `file.type`. */
function withCorrectExtension(file: Blob, originalName: string): File {
  const ext =
    file.type === "image/jpeg"
      ? ".jpg"
      : file.type === "image/png"
        ? ".png"
        : file.type === "image/webp"
          ? ".webp"
          : file.type === "application/pdf"
            ? ".pdf"
            : "";
  const base = originalName.replace(/\.[^.]+$/, "");
  const name =
    ext && !originalName.toLowerCase().endsWith(ext)
      ? `${base}${ext}`
      : originalName;
  return new File([file], name, { type: file.type });
}

// ─── Image compression ───────────────────────────────────────────────────────

export interface CompressImageOptions {
  targetSizeMB: number;
  maxWidthOrHeight?: number;
  /** Output MIME type. Defaults to image/jpeg for best compression. */
  fileType?: string;
}

/**
 * Compress an image file to ≤ `targetSizeMB` using browser-image-compression.
 * The library iteratively reduces quality and dimensions to meet the target.
 *
 * Throws `CompressionError` if the result still exceeds the target, meaning
 * acceptable quality could not be maintained.
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions,
): Promise<File> {
  const targetBytes = options.targetSizeMB * 1024 * 1024;

  if (file.size <= targetBytes) return file;

  const outputType = options.fileType ?? "image/jpeg";

  // First pass: standard compression
  let result = await imageCompression(file, {
    maxSizeMB: options.targetSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 2000,
    useWebWorker: true,
    initialQuality: 0.85,
    fileType: outputType,
  });

  if (result.size <= targetBytes) {
    return withCorrectExtension(result, file.name);
  }

  // Second pass: more aggressive — smaller dimensions, lower quality
  result = await imageCompression(file, {
    maxSizeMB: options.targetSizeMB,
    maxWidthOrHeight: 1400,
    useWebWorker: true,
    initialQuality: 0.6,
    fileType: outputType,
  });

  if (result.size <= targetBytes) {
    return withCorrectExtension(result, file.name);
  }

  throw new CompressionError(
    `Unable to compress "${file.name}" to ${formatMB(options.targetSizeMB)} while maintaining acceptable quality. Please upload a smaller file.`,
  );
}

// ─── PDF compression ─────────────────────────────────────────────────────────

/**
 * Compress a PDF file to ≤ `targetSizeMB`.
 *
 * Strategy:
 * 1. Re-save with pdf-lib using object streams (lossless, sometimes helps).
 * 2. If still too large, rasterise pages via pdfjs-dist at decreasing DPI/quality
 *    and rebuild as an image-based PDF. This preserves visual appearance (text,
 *    QR codes, signatures) but removes the text layer.
 *
 * Throws `CompressionError` if the result still exceeds the target.
 */
export async function compressPdf(
  file: File,
  targetSizeMB: number,
): Promise<File> {
  const targetBytes = targetSizeMB * 1024 * 1024;

  if (file.size <= targetBytes) return file;

  // ── Step 1: Lossless re-save ──────────────────────────────────────────────
  let pdfDoc: PDFDocument;
  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
  } catch (err: any) {
    const msg: string = err?.message ?? "";
    if (
      msg.toLowerCase().includes("encrypt") ||
      msg.toLowerCase().includes("password")
    ) {
      throw new CompressionError(
        `"${file.name}" is password-protected. Please upload an unlocked PDF.`,
      );
    }
    throw new CompressionError(
      `Unable to read "${file.name}". The file may be corrupted.`,
    );
  }

  const reSaved = await pdfDoc.save({ useObjectStreams: true });
  if (reSaved.byteLength <= targetBytes) {
    const buf = reSaved.buffer.slice(
      reSaved.byteOffset,
      reSaved.byteOffset + reSaved.byteLength,
    ) as ArrayBuffer;
    return new File([buf], file.name, { type: "application/pdf" });
  }

  // ── Step 2: Rasterise pages ───────────────────────────────────────────────
  const compressed = await rasterizePdf(file, targetSizeMB);
  return compressed;
}

/** Render each PDF page to a JPEG and rebuild as a new PDF, trying multiple DPI/quality combos. */
async function rasterizePdf(file: File, targetSizeMB: number): Promise<File> {
  const targetBytes = targetSizeMB * 1024 * 1024;
  const MAX_DIM = 2000;

  // Dynamic import to avoid SSR issues and keep initial bundle small
  const pdfjsLib: any = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer.slice(0)),
  });
  const srcPdf = await loadingTask.promise;

  // Try configurations from highest to lowest quality
  const configs = [
    { dpi: 200, quality: 0.85 },
    { dpi: 200, quality: 0.75 },
    { dpi: 150, quality: 0.75 },
    { dpi: 150, quality: 0.65 },
    { dpi: 120, quality: 0.65 },
    { dpi: 120, quality: 0.55 },
  ];

  try {
    for (const { dpi, quality } of configs) {
      try {
        const newDoc = await PDFDocument.create();
        const scale = dpi / 72; // PDF user unit = 1/72 inch

        for (let i = 1; i <= srcPdf.numPages; i++) {
          const page = await srcPdf.getPage(i);
          const baseViewport = page.getViewport({ scale: 1 });

          // Cap rendered dimensions to MAX_DIM
          let renderScale = scale;
          if (
            baseViewport.width * scale > MAX_DIM ||
            baseViewport.height * scale > MAX_DIM
          ) {
            renderScale =
              scale *
              Math.min(
                MAX_DIM / (baseViewport.width * scale),
                MAX_DIM / (baseViewport.height * scale),
              );
          }

          const renderViewport = page.getViewport({ scale: renderScale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(renderViewport.width);
          canvas.height = Math.floor(renderViewport.height);
          const ctx = canvas.getContext("2d")!;

          // White background to handle transparent PDFs
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport: renderViewport })
            .promise;

          const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
          const base64 = jpegDataUrl.split(",")[1];
          const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

          const embedded = await newDoc.embedJpg(bytes);

          // Preserve original page dimensions
          const newPage = newDoc.addPage([
            baseViewport.width,
            baseViewport.height,
          ]);
          newPage.drawImage(embedded, {
            x: 0,
            y: 0,
            width: baseViewport.width,
            height: baseViewport.height,
          });
        }

        const saved = await newDoc.save({ useObjectStreams: true });
        if (saved.byteLength <= targetBytes) {
          const buf = saved.buffer.slice(
            saved.byteOffset,
            saved.byteOffset + saved.byteLength,
          ) as ArrayBuffer;
          return new File([buf], file.name, { type: "application/pdf" });
        }
      } catch {
        // Try next configuration
        continue;
      }
    }
  } finally {
    srcPdf.cleanup();
    loadingTask.destroy?.();
  }

  throw new CompressionError(
    `Unable to compress "${file.name}" to ${formatMB(targetSizeMB)} while maintaining acceptable document quality. Please upload a smaller file.`,
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

/**
 * Compress any supported file (image or PDF) to ≤ `targetSizeMB`.
 * Files already under the target are returned unchanged.
 */
export async function compressFile(
  file: File,
  targetSizeMB: number,
  options?: { maxWidthOrHeight?: number },
): Promise<File> {
  if (file.type === "application/pdf") {
    return compressPdf(file, targetSizeMB);
  }
  if (file.type.startsWith("image/")) {
    return compressImage(file, {
      targetSizeMB,
      maxWidthOrHeight: options?.maxWidthOrHeight ?? 2000,
    });
  }
  return file;
}

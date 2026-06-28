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

// ─── EXIF auto-orientation ───────────────────────────────────────────────────

/**
 * Read the EXIF orientation tag (0x0112) from a JPEG file.
 * Returns -1 if not found or not a JPEG.
 */
function getExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const view = new DataView(reader.result as ArrayBuffer);
      if (view.byteLength < 2 || view.getUint16(0, false) !== 0xffd8) {
        resolve(-1);
        return;
      }
      let offset = 2;
      while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xffe1) {
          const length = view.getUint16(offset, false);
          offset += 2;
          if (view.getUint32(offset, false) !== 0x45786966) {
            resolve(-1);
            return;
          }
          offset += 6;
          const tiffOffset = offset;
          const bigEndian = view.getUint16(tiffOffset, false) === 0x4d4d;
          if (view.getUint16(tiffOffset + 2, bigEndian) !== 0x002a) {
            resolve(-1);
            return;
          }
          const ifdOffset =
            tiffOffset + view.getUint32(tiffOffset + 4, bigEndian);
          const entries = view.getUint16(ifdOffset, bigEndian);
          for (let i = 0; i < entries; i++) {
            const entryOffset = ifdOffset + 2 + i * 12;
            const tag = view.getUint16(entryOffset, bigEndian);
            if (tag === 0x0112) {
              resolve(view.getUint16(entryOffset + 8, bigEndian));
              return;
            }
          }
          resolve(-1);
          return;
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(-1);
    };
    reader.onerror = () => resolve(-1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}

/**
 * Apply EXIF orientation to an image file by baking the rotation into the pixel
 * data via canvas. Returns the original file if no orientation is needed.
 */
export async function autoOrientImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const orientation = await getExifOrientation(file);
  if (orientation <= 1 || orientation > 8) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = document.createElement("img");
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    switch (orientation) {
      case 2:
        canvas.width = w;
        canvas.height = h;
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        canvas.width = w;
        canvas.height = h;
        ctx.translate(w, h);
        ctx.rotate(Math.PI);
        break;
      case 4:
        canvas.width = w;
        canvas.height = h;
        ctx.translate(0, h);
        ctx.scale(1, -1);
        break;
      case 5:
        canvas.width = h;
        canvas.height = w;
        ctx.translate(h, 0);
        ctx.scale(-1, 1);
        ctx.rotate(Math.PI / 2);
        break;
      case 6:
        canvas.width = h;
        canvas.height = w;
        ctx.translate(h, 0);
        ctx.rotate(Math.PI / 2);
        break;
      case 7:
        canvas.width = h;
        canvas.height = w;
        ctx.translate(0, w);
        ctx.scale(-1, 1);
        ctx.rotate(-Math.PI / 2);
        break;
      case 8:
        canvas.width = h;
        canvas.height = w;
        ctx.translate(0, w);
        ctx.rotate(-Math.PI / 2);
        break;
    }

    ctx.drawImage(img, 0, 0);

    const outputType =
      file.type === "image/png"
        ? "image/png"
        : file.type === "image/webp"
          ? "image/webp"
          : "image/jpeg";

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to auto-orient image"));
            return;
          }
          resolve(new File([blob], file.name, { type: outputType }));
        },
        outputType,
        outputType === "image/jpeg" ? 0.92 : undefined,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
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

  // Always auto-orient first so EXIF rotation is baked into pixels.
  // This ensures correct orientation in previews, canvas/PDF rendering,
  // and server-side storage regardless of browser EXIF support.
  const oriented = await autoOrientImage(file);

  if (oriented.size <= targetBytes)
    return withCorrectExtension(oriented, file.name);

  const outputType = options.fileType ?? "image/jpeg";

  // First pass: standard compression (use oriented file as input)
  let result = await imageCompression(oriented, {
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
  result = await imageCompression(oriented, {
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

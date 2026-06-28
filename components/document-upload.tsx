"use client";

import React, { useRef, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, X, FileText, AlertCircle, RotateCcw } from "lucide-react";
import {
  compressFile,
  compressImage,
  CompressionError,
} from "@/lib/file-compression";

/** Called whenever the staged files change. null means cleared. */
export interface DocumentUploadProps {
  onFilesChange: (front: File | null, back: File | null) => void;
}

/** Called when a photo is selected/removed. */
export interface PhotoUploadProps {
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_INPUT = 10 * 1024 * 1024; // 10 MB — max size we accept from the user
const MAX_SINGLE = 2.5 * 1024 * 1024; // 2.5 MB — target size after compression
const MAX_COMBINED = 5 * 1024 * 1024; // 5 MB — max combined size after merge
const ACCEPTED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const REJECTED_MIME = ["image/heic", "image/heif", "image/webp"];

interface FileState {
  file: File;
  preview: string | null; // data-url for images, null for PDF
}

type MergeError = string | null;

// ─── helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Embed an image file as a full A4 page into an existing PDFDocument.
 * Handles RGBA (PNG transparency) by flattening to white via canvas.
 * Also resizes large images to avoid bloated output.
 */
async function appendImageAsPdfPage(
  pdfDoc: PDFDocument,
  file: File,
): Promise<void> {
  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;
  const MAX_DIM = 1920;

  const dataUrl = await fileToDataUrl(file);
  const img = document.createElement("img");

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  // Determine scaled dimensions (cap at MAX_DIM)
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (w > MAX_DIM || h > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  // Draw onto canvas to flatten alpha → white
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.85);
  const base64 = jpegDataUrl.split(",")[1];
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const embeddedImage = await pdfDoc.embedJpg(bytes);

  // Scale image to fit within A4, centered
  const scale = Math.min(
    A4_WIDTH / embeddedImage.width,
    A4_HEIGHT / embeddedImage.height,
    1,
  );
  const drawW = embeddedImage.width * scale;
  const drawH = embeddedImage.height * scale;
  const x = (A4_WIDTH - drawW) / 2;
  const y = (A4_HEIGHT - drawH) / 2;

  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });
}

/**
 * Append all pages from a source PDF bytes into pdfDoc.
 * Throws descriptive errors for password-protected or corrupted PDFs.
 */
async function appendPdfPages(
  pdfDoc: PDFDocument,
  pdfBytes: ArrayBuffer,
): Promise<void> {
  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
    });
  } catch (err: any) {
    const msg: string = err?.message ?? "";
    if (
      msg.toLowerCase().includes("encrypt") ||
      msg.toLowerCase().includes("password")
    ) {
      throw new Error(
        "This PDF is password protected. Please upload an unlocked file.",
      );
    }
    throw new Error(
      "This file appears to be corrupted. Please try another file.",
    );
  }

  if (srcDoc.isEncrypted) {
    throw new Error(
      "This PDF is password protected. Please upload an unlocked file.",
    );
  }

  const indices = srcDoc.getPageIndices();
  const copiedPages = await pdfDoc.copyPages(srcDoc, indices);
  copiedPages.forEach((p) => pdfDoc.addPage(p));
}

/**
 * Merge front + optional back into a single PDF.
 * Returns the PDF as a Uint8Array.
 */
async function mergeDocuments(
  front: File,
  back: File | null,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // --- Front ---
  if (front.type === "application/pdf") {
    const buf = await fileToArrayBuffer(front);
    await appendPdfPages(pdfDoc, buf);
  } else {
    await appendImageAsPdfPage(pdfDoc, front);
  }

  // --- Back (optional) ---
  if (back) {
    if (back.type === "application/pdf") {
      const buf = await fileToArrayBuffer(back);
      await appendPdfPages(pdfDoc, buf);
    } else {
      await appendImageAsPdfPage(pdfDoc, back);
    }
  }

  return pdfDoc.save();
}

// ─── validation ─────────────────────────────────────────────────────────────

function validateFile(file: File): string | null {
  if (REJECTED_MIME.includes(file.type)) {
    return `"${file.name}" is not supported. HEIC and WebP files are not accepted. Please convert to JPG, PNG, or PDF.`;
  }
  if (!ACCEPTED_MIME.includes(file.type)) {
    return `"${file.name}" has an unsupported format. Please upload JPG, JPEG, PNG, or PDF only.`;
  }
  if (file.size > MAX_INPUT) {
    return `"${file.name}" is ${formatBytes(file.size)}. Maximum upload size is 10 MB. Please upload a smaller file.`;
  }
  return null;
}

// ─── sub-components ──────────────────────────────────────────────────────────

export interface UploadBoxProps {
  label: string;
  required: boolean;
  fileState: FileState | null;
  isDragging: boolean;
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  accept?: string;
  hint?: string;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onRemove: () => void;
  onReplace: () => void;
  disabled: boolean;
  uploading?: boolean;
}

export function UploadBox({
  label,
  required,
  fileState,
  isDragging,
  error,
  inputRef,
  accept = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
  hint = "JPG, JPEG, PNG, PDF · max 2.5 MB",
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onRemove,
  onReplace,
  disabled,
  uploading = false,
}: UploadBoxProps) {
  return (
    <div className="flex-1 min-w-0 space-y-2">
      <p className="text-sm font-medium text-white flex items-center gap-1.5">
        {label}
        {required ? (
          <span className="text-red-400 text-xs">*</span>
        ) : (
          <span className="text-gray-500 text-xs">Optional</span>
        )}
      </p>

      {uploading ? (
        <div className="border-2 border-dashed border-purple-400/30 rounded-xl p-5 text-center bg-purple-400/5">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-purple-400 text-sm font-medium">Uploading…</p>
          </div>
        </div>
      ) : fileState ? (
        <div className="border-2 border-purple-400/40 rounded-xl p-3 bg-purple-400/5 space-y-2">
          <div className="flex items-center gap-3">
            {fileState.preview ? (
              <img
                src={fileState.preview}
                alt={label}
                className="w-14 h-14 object-cover rounded-lg border border-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 flex-shrink-0 bg-purple-400/10 border border-purple-400/30 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {fileState.file.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatBytes(fileState.file.size)} ·{" "}
                {fileState.file.type === "application/pdf"
                  ? "PDF"
                  : fileState.file.type.split("/")[1].toUpperCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="flex-shrink-0 w-8 h-8 sm:w-7 sm:h-7 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 touch-manipulation"
              title="Remove file"
            >
              <X className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onReplace}
            disabled={disabled}
            className="w-full py-2 sm:py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs disabled:opacity-40 touch-manipulation active:scale-[0.98]"
          >
            <RotateCcw className="h-3 w-3" />
            Replace file
          </button>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onClick}
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-300 touch-manipulation ${
            isDragging
              ? "border-purple-400 bg-purple-400/10 scale-[1.01]"
              : "border-white/20 hover:border-purple-400/50 hover:bg-purple-400/5"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <div
            className={`flex flex-col items-center gap-2 transition-transform ${isDragging ? "scale-105" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isDragging
                  ? "bg-purple-400/20 border border-purple-400/40"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <Upload
                className={`h-5 w-5 transition-colors ${isDragging ? "text-purple-400" : "text-white/40"}`}
              />
            </div>
            <p
              className={`text-sm font-medium transition-colors ${isDragging ? "text-purple-300" : "text-white/70"}`}
            >
              {isDragging ? "Drop here" : "Drag & drop or click"}
            </p>
            <p className="text-xs text-gray-500">{hint}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-1.5 text-red-400 text-xs">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ─── merge helper (exported for use in form submit) ─────────────────────────

export async function mergeDocumentsToFile(
  front: File,
  back: File | null,
  fullName?: string,
): Promise<File> {
  let mergedBytes = await mergeDocuments(front, back);

  // If the merged PDF exceeds the combined limit, attempt to compress it
  if (mergedBytes.byteLength > MAX_COMBINED) {
    const mergedFile = new File(
      [
        mergedBytes.buffer.slice(
          mergedBytes.byteOffset,
          mergedBytes.byteOffset + mergedBytes.byteLength,
        ) as ArrayBuffer,
      ],
      "merged.pdf",
      { type: "application/pdf" },
    );
    try {
      const { compressPdf, CompressionError } =
        await import("@/lib/file-compression");
      const compressed = await compressPdf(
        mergedFile,
        MAX_COMBINED / (1024 * 1024),
      );
      const compressedBytes = await compressed.arrayBuffer();
      mergedBytes = new Uint8Array(compressedBytes);
    } catch (e) {
      if (e instanceof CompressionError) {
        throw new Error(
          "Combined document is too large after compression. Please use lower resolution images or fewer pages.",
        );
      }
      throw new Error(
        "Failed to compress combined document. Please use smaller files.",
      );
    }
  }

  if (mergedBytes.byteLength > MAX_COMBINED) {
    throw new Error(
      "Combined document is too large after processing. Please use lower resolution images.",
    );
  }

  const plainBuffer = mergedBytes.buffer.slice(
    mergedBytes.byteOffset,
    mergedBytes.byteOffset + mergedBytes.byteLength,
  ) as ArrayBuffer;

  const safeName = (fullName ?? "id_proof")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "");
  const fileName = `${safeName}_id_proof.pdf`;

  return new File([plainBuffer], fileName, {
    type: "application/pdf",
  });
}

// ─── main component ──────────────────────────────────────────────────────────

export function DocumentUpload({ onFilesChange }: DocumentUploadProps) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const [front, setFront] = useState<FileState | null>(null);
  const [back, setBack] = useState<FileState | null>(null);

  const [frontDragging, setFrontDragging] = useState(false);
  const [backDragging, setBackDragging] = useState(false);

  const [frontError, setFrontError] = useState<MergeError>(null);
  const [backError, setBackError] = useState<MergeError>(null);
  const [mergeError, setMergeError] = useState<MergeError>(null);
  const [frontProcessing, setFrontProcessing] = useState(false);
  const [backProcessing, setBackProcessing] = useState(false);

  // ── combined raw size progress ─────────────────────────────────────────────
  const combinedRawBytes = (front?.file.size ?? 0) + (back?.file.size ?? 0);
  const combinedPercent = Math.min(
    100,
    (combinedRawBytes / MAX_COMBINED) * 100,
  );
  const combinedExceeds = combinedRawBytes > MAX_COMBINED;

  // ── file handling ──────────────────────────────────────────────────────────

  const buildFileState = useCallback(async (file: File): Promise<FileState> => {
    let preview: string | null = null;
    if (file.type.startsWith("image/")) {
      preview = await fileToDataUrl(file);
    }
    return { file, preview };
  }, []);

  const handleFrontFile = useCallback(
    async (file: File) => {
      setFrontError(null);
      setMergeError(null);
      const err = validateFile(file);
      if (err) {
        setFrontError(err);
        onFilesChange(null, back?.file ?? null);
        return;
      }
      if (
        back &&
        file.name === back.file.name &&
        file.size === back.file.size
      ) {
        setFrontError(
          "This appears to be the same file as the back side. Please upload different files.",
        );
        return;
      }
      setFrontProcessing(true);
      try {
        const compressed = await compressFile(file, MAX_SINGLE / (1024 * 1024));
        const state = await buildFileState(compressed);
        setFront(state);
        onFilesChange(compressed, back?.file ?? null);
      } catch (e: any) {
        const msg =
          e instanceof CompressionError
            ? e.message
            : "Failed to process file. Please try a different file.";
        setFrontError(msg);
        onFilesChange(null, back?.file ?? null);
      } finally {
        setFrontProcessing(false);
      }
    },
    [back, buildFileState, onFilesChange],
  );

  const handleBackFile = useCallback(
    async (file: File) => {
      setBackError(null);
      setMergeError(null);
      const err = validateFile(file);
      if (err) {
        setBackError(err);
        onFilesChange(front?.file ?? null, null);
        return;
      }
      if (
        front &&
        file.name === front.file.name &&
        file.size === front.file.size
      ) {
        setBackError(
          "This appears to be the same file as the front side. Please upload different files.",
        );
        return;
      }
      setBackProcessing(true);
      try {
        const compressed = await compressFile(file, MAX_SINGLE / (1024 * 1024));
        const state = await buildFileState(compressed);
        setBack(state);
        onFilesChange(front?.file ?? null, compressed);
      } catch (e: any) {
        const msg =
          e instanceof CompressionError
            ? e.message
            : "Failed to process file. Please try a different file.";
        setBackError(msg);
        onFilesChange(front?.file ?? null, null);
      } finally {
        setBackProcessing(false);
      }
    },
    [front, buildFileState, onFilesChange],
  );

  const removeFront = () => {
    setFront(null);
    setFrontError(null);
    setBackError(null);
    setMergeError(null);
    onFilesChange(null, back?.file ?? null);
    if (frontInputRef.current) frontInputRef.current.value = "";
  };

  const removeBack = () => {
    setBack(null);
    setBackError(null);
    setFrontError(null);
    setMergeError(null);
    onFilesChange(front?.file ?? null, null);
    if (backInputRef.current) backInputRef.current.value = "";
  };

  // ── drag helpers ───────────────────────────────────────────────────────────

  const handleDrop = useCallback(
    (e: React.DragEvent, side: "front" | "back") => {
      e.preventDefault();
      if (side === "front") setFrontDragging(false);
      else setBackDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (side === "front") handleFrontFile(file);
      else handleBackFile(file);
    },
    [handleFrontFile, handleBackFile],
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Upload boxes — side by side */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <UploadBox
          label="Front Side"
          required
          fileState={front}
          isDragging={frontDragging}
          error={frontError}
          inputRef={frontInputRef}
          hint="JPG, JPEG, PNG, PDF · max 10 MB (auto-compressed)"
          onDragOver={(e) => {
            e.preventDefault();
            setFrontDragging(true);
          }}
          onDragLeave={() => setFrontDragging(false)}
          onDrop={(e) => handleDrop(e, "front")}
          onClick={() => frontInputRef.current?.click()}
          onRemove={removeFront}
          onReplace={() => frontInputRef.current?.click()}
          disabled={frontProcessing || backProcessing}
          uploading={frontProcessing}
        />
        <UploadBox
          label="Back Side"
          required={false}
          fileState={back}
          isDragging={backDragging}
          error={backError}
          inputRef={backInputRef}
          hint="JPG, JPEG, PNG, PDF · max 10 MB (auto-compressed)"
          onDragOver={(e) => {
            e.preventDefault();
            setBackDragging(true);
          }}
          onDragLeave={() => setBackDragging(false)}
          onDrop={(e) => handleDrop(e, "back")}
          onClick={() => backInputRef.current?.click()}
          onRemove={removeBack}
          onReplace={() => backInputRef.current?.click()}
          disabled={frontProcessing || backProcessing}
          uploading={backProcessing}
        />
      </div>

      {/* Hidden file inputs */}
      <input
        ref={frontInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFrontFile(file);
          e.target.value = "";
        }}
      />
      <input
        ref={backInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleBackFile(file);
          e.target.value = "";
        }}
      />

      {/* Combined size progress bar */}
      {(front || back) && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Combined file size</span>
            <span
              className={
                combinedExceeds ? "text-red-400 font-medium" : "text-gray-400"
              }
            >
              {formatBytes(combinedRawBytes)} / {formatBytes(MAX_COMBINED)}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                combinedExceeds
                  ? "bg-red-500"
                  : combinedPercent > 75
                    ? "bg-yellow-400"
                    : "bg-gradient-to-r from-purple-400 to-purple-500"
              }`}
              style={{ width: `${combinedPercent}%` }}
            />
          </div>
          {combinedExceeds && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              Combined size exceeds 5 MB after compression. Please use smaller
              files.
            </p>
          )}
        </div>
      )}

      {/* Merge error */}
      {mergeError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{mergeError}</span>
        </div>
      )}

      {/* Hint text */}
      {!front && (
        <p className="text-xs text-gray-500 text-center">
          Upload the front side of your ID proof to continue. Back side is
          optional.
        </p>
      )}
    </div>
  );
}

// ─── PhotoUpload component ───────────────────────────────────────────────────

const PHOTO_ACCEPTED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const PHOTO_MAX_INPUT = 10 * 1024 * 1024; // 10 MB — max size we accept from the user
const PHOTO_TARGET_SIZE = 5 * 1024 * 1024; // 5 MB — target size after compression

export function PhotoUpload({
  onFileChange,
  disabled = false,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!PHOTO_ACCEPTED_MIME.includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        onFileChange(null);
        return;
      }
      if (file.size > PHOTO_MAX_INPUT) {
        setError(
          `File is ${formatBytes(file.size)}. Maximum upload size is 10 MB.`,
        );
        onFileChange(null);
        return;
      }
      setProcessing(true);
      try {
        const compressed = await compressImage(file, {
          targetSizeMB: PHOTO_TARGET_SIZE / (1024 * 1024),
          maxWidthOrHeight: 1920,
        });
        const preview = await fileToDataUrl(compressed);
        setFileState({ file: compressed, preview });
        onFileChange(compressed);
      } catch (e: any) {
        const msg =
          e instanceof CompressionError
            ? e.message
            : "Failed to process image. Please try a different file.";
        setError(msg);
        onFileChange(null);
      } finally {
        setProcessing(false);
      }
    },
    [onFileChange],
  );

  const removeFile = () => {
    setFileState(null);
    setError(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <UploadBox
        label="Profile Photo"
        required
        fileState={fileState}
        isDragging={isDragging}
        error={error}
        inputRef={inputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        hint="JPG, PNG, WebP · max 10 MB (auto-compressed)"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        onRemove={removeFile}
        onReplace={() => inputRef.current?.click()}
        disabled={disabled || processing}
        uploading={processing}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

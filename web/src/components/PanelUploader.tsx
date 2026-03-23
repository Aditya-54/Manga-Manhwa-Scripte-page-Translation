"use client";

import { useCallback, useState, useRef } from "react";

interface PanelUploaderProps {
    onFileSelected: (file: File, previewUrl: string) => void;
    isProcessing?: boolean;
}

export default function PanelUploader({ onFileSelected, isProcessing }: PanelUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith("image/")) return;
            const url = URL.createObjectURL(file);
            setPreview(url);
            onFileSelected(file, url);
        },
        [onFileSelected]
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback(() => setIsDragging(false), []);

    return (
        <div className="w-full">
            {!preview ? (
                <div
                    className={`drop-zone ${isDragging ? "active" : ""} rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer min-h-[300px]`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-6xl mb-4 animate-float">📄</div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Drop your manga page here
                    </h3>
                    <p style={{ color: "var(--manga-gray-dark)" }}>
                        or click to browse • JPG, PNG, WebP
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />
                </div>
            ) : (
                <div className="card-brutal p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="badge-brutal" style={{ background: "var(--manga-yellow)" }}>
                            ✓ Image Loaded
                        </span>
                        {!isProcessing && (
                            <button
                                onClick={() => {
                                    setPreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="btn-brutal btn-brutal-outline text-sm py-1 px-3"
                            >
                                ✕ Remove
                            </button>
                        )}
                    </div>
                    <div className="brutal-border rounded-lg overflow-hidden">
                        <img
                            src={preview}
                            alt="Uploaded manga panel"
                            className="w-full h-auto max-h-[400px] object-contain"
                            style={{ background: "var(--manga-gray)" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

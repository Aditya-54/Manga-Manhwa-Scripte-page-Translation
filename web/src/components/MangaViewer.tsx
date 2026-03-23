"use client";

import { Bubble } from "@/lib/api";
import { useRef, useEffect, useState } from "react";

interface MangaViewerProps {
    imageUrl: string | null;
    bubbles: Bubble[];
    activeBubbleId: number | null;
    onBubbleClick?: (bubble: Bubble) => void;
    showOverlays?: boolean;
    imageWidth?: number;
    imageHeight?: number;
}

export default function MangaViewer({
    imageUrl,
    bubbles,
    activeBubbleId,
    onBubbleClick,
    showOverlays = true,
    imageWidth = 0,
    imageHeight = 0,
}: MangaViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (!containerRef.current || !imageUrl) return;

        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;
            const containerWidth = container.clientWidth;
            const naturalW = imageWidth || imgNaturalSize.w;
            if (naturalW > 0) {
                setScale(containerWidth / naturalW);
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, [imageUrl, imageWidth, imgNaturalSize.w]);

    if (!imageUrl) {
        return (
            <div className="card-brutal p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center" style={{ color: "var(--manga-gray-dark)" }}>
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        No image loaded
                    </p>
                    <p className="text-sm mt-1">Upload a manga page to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-brutal overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2" style={{ background: "var(--manga-black)", color: "white" }}>
                <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    🖼️ MANGA VIEWER
                </span>
                <span className="text-xs" style={{ color: "var(--manga-gray)" }}>
                    {bubbles.length} bubble{bubbles.length !== 1 ? "s" : ""} detected
                </span>
            </div>

            <div ref={containerRef} className="relative" style={{ background: "var(--manga-gray)" }}>
                <img
                    src={imageUrl}
                    alt="Manga panel"
                    className="w-full h-auto block"
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                    }}
                />

                {showOverlays &&
                    bubbles.map((bubble) => {
                        const { x1, y1, x2, y2 } = bubble.bbox;
                        const isActive = bubble.id === activeBubbleId;
                        const hasTranslation = !!bubble.translated_text;

                        return (
                            <div
                                key={bubble.id}
                                onClick={() => onBubbleClick?.(bubble)}
                                className={`absolute cursor-pointer transition-all duration-200 ${isActive ? "animate-bubble-glow" : ""}`}
                                style={{
                                    left: x1 * scale,
                                    top: y1 * scale,
                                    width: (x2 - x1) * scale,
                                    height: (y2 - y1) * scale,
                                    border: isActive
                                        ? "3px solid var(--manga-red)"
                                        : hasTranslation
                                            ? "2px solid rgba(230, 57, 70, 0.6)"
                                            : "2px dashed rgba(26, 26, 46, 0.4)",
                                    borderRadius: "4px",
                                    background: isActive
                                        ? "rgba(230, 57, 70, 0.1)"
                                        : "transparent",
                                }}
                            >
                                {/* Bubble ID badge */}
                                <div
                                    className="absolute -top-3 -left-1 text-xs font-bold px-1.5 py-0.5 rounded"
                                    style={{
                                        background: hasTranslation ? "var(--manga-red)" : "var(--manga-black)",
                                        color: "white",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "10px",
                                        zIndex: 20,
                                    }}
                                >
                                    #{bubble.id + 1}
                                </div>

                                {/* Show translated text overlay if translated */}
                                {hasTranslation && (
                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center p-2"
                                        style={{
                                            background: "white",
                                            borderRadius: "50%",
                                            transform: "scale(1.15)",
                                            boxShadow: isActive ? "0 0 0 3px var(--manga-red)" : "none",
                                            zIndex: isActive ? 10 : 5,
                                        }}
                                    >
                                        <p
                                            className="text-center font-bold text-sm leading-tight w-full break-words px-2"
                                            style={{
                                                color: "var(--manga-black)",
                                                fontFamily: "var(--font-body)",
                                                transform: "scale(0.87)", // counter the parent scaling
                                            }}
                                        >
                                            {bubble.translated_text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

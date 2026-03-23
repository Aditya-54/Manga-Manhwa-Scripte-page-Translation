"use client";

import { Bubble } from "@/lib/api";

interface TranslationPanelProps {
    bubbles: Bubble[];
    activeBubbleId: number | null;
    onBubbleSelect: (id: number) => void;
    onTranslateBubble: (bubble: Bubble) => void;
    isTranslating?: boolean;
    translatingBubbleId?: number | null;
}

export default function TranslationPanel({
    bubbles,
    activeBubbleId,
    onBubbleSelect,
    onTranslateBubble,
    isTranslating,
    translatingBubbleId,
}: TranslationPanelProps) {
    if (bubbles.length === 0) {
        return (
            <div className="card-brutal p-6">
                <div className="text-center" style={{ color: "var(--manga-gray-dark)" }}>
                    <div className="text-4xl mb-2">💬</div>
                    <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        No bubbles yet
                    </p>
                    <p className="text-sm">Upload an image and detect bubbles first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    Detected Bubbles
                </h3>
                <span
                    className="badge-brutal"
                    style={{ background: "var(--manga-yellow)" }}
                >
                    {bubbles.length}
                </span>
            </div>

            {bubbles.map((bubble) => {
                const isActive = bubble.id === activeBubbleId;
                const isThisTranslating = isTranslating && translatingBubbleId === bubble.id;

                return (
                    <div
                        key={bubble.id}
                        onClick={() => onBubbleSelect(bubble.id)}
                        className={`card-brutal p-4 cursor-pointer ${isActive ? "" : ""}`}
                        style={{
                            borderColor: isActive ? "var(--manga-primary)" : undefined,
                            background: isActive ? "rgba(255, 255, 255, 0.03)" : undefined,
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span
                                className="badge-brutal"
                                style={{
                                    background: bubble.translated_text ? "var(--manga-primary)" : "transparent",
                                    color: bubble.translated_text ? "white" : "var(--manga-text-muted)",
                                    borderColor: bubble.translated_text ? "var(--manga-primary)" : "var(--manga-border)",
                                }}
                            >
                                Bubble #{bubble.id + 1}
                            </span>
                            {bubble.skipped && (
                                <span className="text-xs" style={{ color: "var(--manga-gray-dark)" }}>
                                    Skipped (empty)
                                </span>
                            )}
                        </div>

                        {bubble.japanese_text && (
                            <div className="mb-2">
                                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--manga-text-muted)" }}>
                                    Japanese
                                </label>
                                <p
                                    className="mt-1 text-sm p-3 rounded-lg"
                                    style={{
                                        background: "var(--manga-bg)",
                                        border: "1px solid var(--manga-border)",
                                        fontFamily: "var(--font-body)",
                                    }}
                                >
                                    {bubble.japanese_text}
                                </p>
                            </div>
                        )}

                        {bubble.translated_text ? (
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--manga-primary)" }}>
                                    English
                                </label>
                                <p
                                    className="mt-1 text-sm p-3 rounded-lg font-medium animate-text-reveal"
                                    style={{
                                        background: "rgba(139, 92, 246, 0.1)",
                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                        color: "var(--manga-text)",
                                    }}
                                >
                                    {bubble.translated_text}
                                </p>
                            </div>
                        ) : bubble.japanese_text ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTranslateBubble(bubble);
                                }}
                                disabled={isThisTranslating}
                                className="btn-brutal btn-brutal-primary text-xs py-1 px-3 w-full justify-center"
                            >
                                {isThisTranslating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⚡</span> Translating...
                                    </span>
                                ) : (
                                    "⚡ Translate"
                                )}
                            </button>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import { Bubble } from "@/lib/api";
import { useState, useCallback, useRef, useEffect } from "react";

interface NarrationPlayerProps {
    bubbles: Bubble[];
    onBubbleHighlight: (id: number | null) => void;
}

export default function NarrationPlayer({
    bubbles,
    onBubbleHighlight,
}: NarrationPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const translatedBubbles = bubbles.filter(
        (b) => b.translated_text && !b.skipped
    );

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentIndex(-1);
        onBubbleHighlight(null);
    }, [onBubbleHighlight]);

    const playFrom = useCallback(
        (index: number) => {
            if (index >= translatedBubbles.length) {
                stop();
                return;
            }

            const bubble = translatedBubbles[index];
            setCurrentIndex(index);
            onBubbleHighlight(bubble.id);

            const utterance = new SpeechSynthesisUtterance(bubble.translated_text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.onend = () => playFrom(index + 1);
            utterance.onerror = () => stop();

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [translatedBubbles, onBubbleHighlight, stop]
    );

    const play = useCallback(() => {
        if (translatedBubbles.length === 0) return;
        setIsPlaying(true);
        playFrom(0);
    }, [translatedBubbles, playFrom]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    if (translatedBubbles.length === 0) return null;

    return (
        <div className="card-brutal p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        🎙️ Narration
                    </h3>
                    <span className="text-xs" style={{ color: "var(--manga-gray-dark)" }}>
                        {translatedBubbles.length} bubble{translatedBubbles.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="flex gap-2">
                    {!isPlaying ? (
                        <button
                            onClick={play}
                            className="btn-brutal btn-brutal-primary text-xs py-1 px-3"
                        >
                            ▶ Play
                        </button>
                    ) : (
                        <button
                            onClick={stop}
                            className="btn-brutal btn-brutal-dark text-xs py-1 px-3"
                        >
                            ■ Stop
                        </button>
                    )}
                </div>
            </div>

            {isPlaying && currentIndex >= 0 && (
                <div className="mt-2 p-2 rounded animate-text-reveal" style={{ background: "var(--manga-cream)" }}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="badge-brutal" style={{ background: "var(--manga-red)", color: "white", fontSize: "9px", padding: "1px 6px" }}>
                            #{translatedBubbles[currentIndex]?.id + 1}
                        </span>
                        <span className="text-xs" style={{ color: "var(--manga-gray-dark)" }}>
                            Speaking...
                        </span>
                    </div>
                    <p className="text-sm font-medium">{translatedBubbles[currentIndex]?.translated_text}</p>
                </div>
            )}

            {/* Progress bar */}
            {isPlaying && (
                <div className="mt-2 flex gap-1">
                    {translatedBubbles.map((_, i) => (
                        <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                                background:
                                    i < currentIndex
                                        ? "var(--manga-red)"
                                        : i === currentIndex
                                            ? "var(--manga-yellow)"
                                            : "var(--manga-gray)",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

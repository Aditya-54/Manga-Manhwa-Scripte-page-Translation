"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import PanelUploader from "@/components/PanelUploader";
import MangaViewer from "@/components/MangaViewer";
import TranslationPanel from "@/components/TranslationPanel";
import ContextEditor from "@/components/ContextEditor";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NarrationPlayer from "@/components/NarrationPlayer";
import { PipelineLoader } from "@/components/SkeletonLoader";
import { Bubble, detectBubbles, translateText, processFullPipeline, renderFinalImage } from "@/lib/api";

type PipelineMode = "step" | "full";

export default function DashboardPage() {
    // State
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [activeBubbleId, setActiveBubbleId] = useState<number | null>(null);
    const [contextPrompt, setContextPrompt] = useState("");
    const [targetLocale, setTargetLocale] = useState("en");
    const [pipelineMode, setPipelineMode] = useState<PipelineMode>("step");
    const [imageSize, setImageSize] = useState({ w: 0, h: 0 });

    // Loading states
    const [isDetecting, setIsDetecting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatingBubbleId, setTranslatingBubbleId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState("");
    const [showResult, setShowResult] = useState(false);

    const handleFileSelected = useCallback((f: File, url: string) => {
        setFile(f);
        setPreviewUrl(url);
        setBubbles([]);
        setActiveBubbleId(null);
        setResultImageUrl(null);
        setShowResult(false);
    }, []);

    // Step-by-step: Detect
    const handleDetect = useCallback(async () => {
        if (!file) return;
        setIsDetecting(true);
        try {
            const data = await detectBubbles(file);
            setBubbles(data.bubbles);
            setImageSize({ w: data.image_width, h: data.image_height });
        } catch (err) {
            console.error("Detection failed:", err);
        } finally {
            setIsDetecting(false);
        }
    }, [file]);

    // Step-by-step: Translate one bubble
    const handleTranslateBubble = useCallback(
        async (bubble: Bubble) => {
            setIsTranslating(true);
            setTranslatingBubbleId(bubble.id);
            setActiveBubbleId(bubble.id);
            try {
                const data = await translateText(
                    bubble.japanese_text,
                    contextPrompt,
                    "ja",
                    targetLocale
                );
                setBubbles((prev) =>
                    prev.map((b) =>
                        b.id === bubble.id ? { ...b, translated_text: data.translation } : b
                    )
                );
            } catch (err) {
                console.error("Translation failed:", err);
            } finally {
                setIsTranslating(false);
                setTranslatingBubbleId(null);
            }
        },
        [contextPrompt, targetLocale]
    );

    // Translate all bubbles
    const handleTranslateAll = useCallback(async () => {
        const untranslated = bubbles.filter(
            (b) => b.japanese_text && !b.translated_text && !b.skipped
        );
        for (const bubble of untranslated) {
            await handleTranslateBubble(bubble);
        }
    }, [bubbles, handleTranslateBubble]);

    // Step-by-step: Render final image
    const handleRenderFinal = useCallback(async () => {
        if (!file || bubbles.length === 0) return;
        setIsProcessing(true);
        setProcessingStep("Rendering final image (inpainting + typesetting)...");
        try {
            const data = await renderFinalImage(file, bubbles);
            const dataUrl = `data:image/png;base64,${data.result_image}`;
            setResultImageUrl(dataUrl);
            setShowResult(true);

            // Auto-trigger download
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "mangascribe_translation.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Render failed:", err);
        } finally {
            setIsProcessing(false);
            setProcessingStep("");
        }
    }, [file, bubbles]);

    // Full pipeline
    const handleFullPipeline = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        setProcessingStep("Running full pipeline: detect → OCR → translate → clean → typeset...");
        try {
            const data = await processFullPipeline(file, contextPrompt, targetLocale);
            setBubbles(data.bubbles);
            setImageSize({ w: data.image_width, h: data.image_height });
            setResultImageUrl(`data:image/png;base64,${data.result_image}`);
            setShowResult(true);
        } catch (err) {
            console.error("Pipeline failed:", err);
        } finally {
            setIsProcessing(false);
            setProcessingStep("");
        }
    }, [file, contextPrompt, targetLocale]);

    const viewerImageUrl = showResult && resultImageUrl ? resultImageUrl : previewUrl;

    return (
        <div className="flex flex-col min-h-screen" style={{ background: "var(--manga-bg)" }}>
            {/* ── Top Bar ── */}
            <nav
                className="px-4 py-3 flex items-center justify-between"
                style={{
                    background: "var(--manga-surface)",
                    borderBottom: "1px solid var(--manga-border)",
                }}
            >
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                    >
                        <span
                            className="text-lg font-bold"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            MangaScribe
                        </span>
                    </Link>
                    <span className="text-white/30">│</span>
                    <span
                        className="text-sm text-white/60"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Translation Studio
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher value={targetLocale} onChange={setTargetLocale} />
                </div>
            </nav>

            {/* ── Main Content ── */}
            <div className="flex-1 p-4 max-w-[1600px] mx-auto w-full">
                {/* Controls Row */}
                <div className="grid lg:grid-cols-[1fr_auto] gap-4 mb-4">
                    <ContextEditor value={contextPrompt} onChange={setContextPrompt} />

                    <div className="card-brutal p-3 flex items-center gap-3">
                        <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{
                                color: "var(--manga-text-muted)",
                                fontFamily: "var(--font-display)",
                            }}
                        >
                            Mode
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPipelineMode("step")}
                                className="badge-brutal cursor-pointer transition-colors"
                                style={{
                                    background: pipelineMode === "step" ? "var(--manga-primary)" : "transparent",
                                    color: pipelineMode === "step" ? "white" : "var(--manga-text-muted)",
                                    borderColor: pipelineMode === "step" ? "var(--manga-primary)" : "var(--manga-border)",
                                }}
                            >
                                Step-by-Step
                            </button>
                            <button
                                onClick={() => setPipelineMode("full")}
                                className="badge-brutal cursor-pointer transition-colors"
                                style={{
                                    background: pipelineMode === "full" ? "var(--manga-primary)" : "transparent",
                                    color: pipelineMode === "full" ? "white" : "var(--manga-text-muted)",
                                    borderColor: pipelineMode === "full" ? "var(--manga-primary)" : "var(--manga-border)",
                                }}
                            >
                                Full Auto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-[1fr_380px] gap-4">
                    {/* Left: Viewer */}
                    <div className="space-y-4">
                        {!previewUrl ? (
                            <PanelUploader
                                onFileSelected={handleFileSelected}
                                isProcessing={isProcessing}
                            />
                        ) : isProcessing ? (
                            <PipelineLoader step={processingStep} />
                        ) : (
                            <>
                                <MangaViewer
                                    imageUrl={viewerImageUrl}
                                    bubbles={showResult ? [] : bubbles}
                                    activeBubbleId={activeBubbleId}
                                    onBubbleClick={(b) => setActiveBubbleId(b.id)}
                                    showOverlays={!showResult}
                                    imageWidth={imageSize.w}
                                    imageHeight={imageSize.h}
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    {pipelineMode === "step" ? (
                                        <>
                                            <button
                                                onClick={handleDetect}
                                                disabled={isDetecting}
                                                className="btn-brutal btn-brutal-primary"
                                            >
                                                {isDetecting ? "🔍 Detecting..." : "🔍 Detect Bubbles"}
                                            </button>
                                            {bubbles.length > 0 && (
                                                <button
                                                    onClick={handleTranslateAll}
                                                    disabled={isTranslating}
                                                    className="btn-brutal btn-brutal-secondary"
                                                >
                                                    {isTranslating
                                                        ? "⚡ Translating..."
                                                        : "⚡ Translate All"}
                                                </button>
                                            )}
                                            {bubbles.some(b => b.translated_text) && (
                                                <button
                                                    onClick={handleRenderFinal}
                                                    disabled={isProcessing}
                                                    className="btn-brutal btn-brutal-primary"
                                                    style={{ background: "var(--manga-purple)", borderColor: "var(--manga-purple)" }}
                                                >
                                                    ✨ Apply Translations & Download
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleFullPipeline}
                                            disabled={isProcessing}
                                            className="btn-brutal btn-brutal-primary text-lg px-6"
                                        >
                                            {isProcessing
                                                ? "🚀 Processing..."
                                                : "🚀 Run Full Pipeline"}
                                        </button>
                                    )}

                                    {showResult && (
                                        <button
                                            onClick={() => setShowResult(!showResult)}
                                            className="btn-brutal btn-brutal-outline"
                                        >
                                            {showResult ? "👁️ Show Original" : "🖼️ Show Result"}
                                        </button>
                                    )}

                                    {resultImageUrl && (
                                        <a
                                            href={resultImageUrl}
                                            download="mangascribe_result.png"
                                            className="btn-brutal btn-brutal-dark"
                                        >
                                            💾 Download
                                        </a>
                                    )}

                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setPreviewUrl(null);
                                            setBubbles([]);
                                            setResultImageUrl(null);
                                            setShowResult(false);
                                            setActiveBubbleId(null);
                                        }}
                                        className="btn-brutal btn-brutal-outline"
                                    >
                                        ✕ New Image
                                    </button>
                                </div>

                                {/* Narration Player */}
                                {bubbles.some((b) => b.translated_text) && (
                                    <NarrationPlayer
                                        bubbles={bubbles}
                                        onBubbleHighlight={setActiveBubbleId}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Right: Translation Panel */}
                    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                        <TranslationPanel
                            bubbles={bubbles}
                            activeBubbleId={activeBubbleId}
                            onBubbleSelect={setActiveBubbleId}
                            onTranslateBubble={handleTranslateBubble}
                            isTranslating={isTranslating}
                            translatingBubbleId={translatingBubbleId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

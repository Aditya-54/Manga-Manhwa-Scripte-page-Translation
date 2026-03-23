"use client";

import { useState } from "react";

interface ContextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const PRESETS = [
    {
        label: "🔥 Action / Shonen",
        prompt:
            "This is an action manga scene. Characters speak with high energy, determination, and intensity. Preserve battle cries, exclamations, and dramatic declarations. Keep the language punchy and powerful.",
    },
    {
        label: "💀 Dark / Seinen",
        prompt:
            "This is a dark, mature manga scene. The tone is serious, possibly violent or psychological. Characters speak with cold precision or raw emotion. Do not soften the language — preserve the gritty, intense atmosphere.",
    },
    {
        label: "💕 Romance / Shoujo",
        prompt:
            "This is a romantic manga scene. Characters speak softly, emotionally, and sometimes awkwardly. Preserve the tenderness, blushing hesitations, and heartfelt confessions. Keep the tone warm and gentle.",
    },
    {
        label: "😂 Comedy / Gag",
        prompt:
            "This is a comedy manga scene. Characters are exaggerated, loud, and over-the-top. Preserve puns where possible, keep the humor natural in English, and maintain the slapstick energy.",
    },
    {
        label: "🧠 Psychological / Thriller",
        prompt:
            "This is a psychological thriller scene. Characters speak with calculated menace, intellectual superiority, or paranoid fear. Preserve the tension, mind-games, and subtle threats in the dialogue.",
    },
];

export default function ContextEditor({ value, onChange }: ContextEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="card-brutal p-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
            >
                <h3
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    🧠 Context Prompt (MCP-Style)
                </h3>
                <span
                    className="text-lg transition-transform duration-200"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}
                >
                    ▾
                </span>
            </button>

            {isExpanded && (
                <div className="mt-3 animate-text-reveal">
                    <p className="text-xs mb-3" style={{ color: "var(--manga-gray-dark)" }}>
                        Context prompts tell the AI about the scene, character, and tone — producing
                        translations that preserve emotional weight instead of flat, generic output.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => onChange(preset.prompt)}
                                className="badge-brutal cursor-pointer transition-colors hover:text-white"
                                style={{
                                    background: value === preset.prompt ? "var(--manga-primary)" : "transparent",
                                    color: value === preset.prompt ? "white" : "var(--manga-text-muted)",
                                    borderColor: value === preset.prompt ? "var(--manga-primary)" : "var(--manga-border)",
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Describe the series, character, scene mood, and emotional tone..."
                        className="input-brutal min-h-[100px] resize-y"
                        style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}
                    />
                </div>
            )}
        </div>
    );
}

"use client";

export default function SkeletonLoader({ lines = 3 }: { lines?: number }) {
    return (
        <div className="card-brutal p-4 space-y-3">
            <div
                className="h-4 w-1/3 rounded animate-skeleton"
                style={{ background: "var(--manga-gray)" }}
            />
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-3 rounded animate-skeleton"
                    style={{
                        background: "var(--manga-gray)",
                        width: `${85 - i * 15}%`,
                        animationDelay: `${i * 0.15}s`,
                    }}
                />
            ))}
        </div>
    );
}

export function PipelineLoader({ step }: { step: string }) {
    return (
        <div className="card-brutal p-6 text-center">
            <div className="text-4xl mb-3 animate-float">⚡</div>
            <h3
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-display)" }}
            >
                Processing...
            </h3>
            <p className="text-sm" style={{ color: "var(--manga-gray-dark)" }}>
                {step}
            </p>
            <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-full animate-skeleton"
                        style={{
                            background: "var(--manga-red)",
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

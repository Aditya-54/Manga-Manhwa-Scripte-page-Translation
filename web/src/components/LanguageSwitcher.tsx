"use client";

interface LanguageSwitcherProps {
    value: string;
    onChange: (locale: string) => void;
}

const LANGUAGES = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "Hindi", flag: "🇮🇳" },
];

export default function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
    return (
        <div className="flex items-center gap-2">
            <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--manga-gray-dark)", fontFamily: "var(--font-display)" }}
            >
                Target
            </label>
            <div className="flex gap-1 flex-wrap">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => onChange(lang.code)}
                        className="badge-brutal cursor-pointer transition-all hover:translate-y-[-1px]"
                        style={{
                            background:
                                value === lang.code ? "var(--manga-red)" : "white",
                            color: value === lang.code ? "white" : "var(--manga-black)",
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                        }}
                        title={lang.label}
                    >
                        {lang.flag} {lang.code.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}

import Link from "next/link";

const FEATURES = [
  {
    icon: "🔍",
    title: "AI Bubble Detection",
    description: "YOLOv8 model trained on manga speech bubbles finds every dialogue box automatically.",
    color: "var(--manga-red)",
  },
  {
    icon: "📖",
    title: "Japanese OCR",
    description: "MangaOCR accurately reads vertical and horizontal Japanese text from cropped bubbles.",
    color: "var(--manga-yellow)",
  },
  {
    icon: "🧠",
    title: "Context-Aware Translation",
    description: "Lingo.dev SDK translates with MCP-style prompts — preserving character voice, tone, and emotional intensity.",
    color: "var(--manga-purple)",
  },
  {
    icon: "🧹",
    title: "Smart Inpainting",
    description: "LaMa neural network + OpenCV removes original text while preserving artwork and bubble shapes.",
    color: "var(--manga-blue)",
  },
  {
    icon: "✍️",
    title: "Auto Typesetting",
    description: "Translated text is word-wrapped and centered back into each bubble with outline rendering.",
    color: "var(--manga-red-dark)",
  },
  {
    icon: "🎙️",
    title: "Narration Engine",
    description: "Web Speech API reads translations aloud with synchronized bubble highlighting.",
    color: "var(--manga-dark)",
  },
];

const PIPELINE_STEPS = [
  { step: "01", label: "DETECT", desc: "Find speech bubbles", icon: "🔍" },
  { step: "02", label: "OCR", desc: "Read Japanese text", icon: "📖" },
  { step: "03", label: "TRANSLATE", desc: "AI translation", icon: "🧠" },
  { step: "04", label: "CLEAN", desc: "Inpaint text", icon: "🧹" },
  { step: "05", label: "TYPESET", desc: "Render English", icon: "✍️" },
];

const DEMO_COMPARISON = {
  original: "「この世界から一人残らず駆逐してやる」",
  generic: "I will exterminate them.",
  contextAware: "I'll eradicate every last one of them from this world.",
  contextAwareHindi: "मैं इस दुनिया से उनका नामोनिशान मिटा दूंगा।",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--manga-cream)" }}>
      {/* ── Navigation ── */}
      <nav
        className="brutal-border-thick px-6 py-3 flex items-center justify-between"
        style={{ background: "var(--manga-black)", borderBottom: "4px solid var(--manga-red)" }}
      >
        <div className="flex items-center gap-3">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--manga-secondary)" }}
          >
            MangaScribe
          </h1>
          <span
            className="badge-brutal text-xs"
            style={{
              background: "var(--manga-red)",
              color: "white",
              borderColor: "var(--manga-red)",
            }}
          >
            v2.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Aditya-54/Manga-Manhwa-Scripte-page-Translation"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal btn-brutal-dark text-xs py-2 px-4 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star Repo
          </a>
          <Link href="/dashboard" className="btn-brutal btn-brutal-primary text-sm py-2 px-6">
            Launch Studio
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4">
              <span
                className="badge-brutal"
                style={{ padding: "0.4rem 1rem" }}
              >
                AI-POWERED SCANLATION
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Translate Manga & Manhwa
              <br />
              <span style={{ color: "var(--manga-primary)" }}>In One Click</span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-lg"
              style={{ color: "var(--manga-accent)", fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
            >
              Drop a manga or manhwa page → AI detects bubbles, reads raw Japanese/Korean texts, translates to English & Hindi with
              character-aware context, cleans the art, and typesets{" "}
              <span className="text-white">automagically</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link href="/dashboard" className="btn-brutal btn-brutal-primary text-lg px-8 py-4 justify-center">
                Open Translation Studio
              </Link>
            </div>
          </div>

          {/* Hero Images Collage */}
          <div className="relative h-[400px] md:h-[500px] w-full mt-8 lg:mt-0 flex justify-center items-center">
            {/* Background Left */}
            <div className="absolute left-[0%] top-[20%] w-[45%] rounded-xl overflow-hidden brutal-shadow z-10 transition-all duration-500 hover:scale-110 hover:z-40" style={{ transform: "rotate(-12deg)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img
                src="https://pbs.twimg.com/media/Et9jN_YWYAQWxM_.jpg"
                alt="Manga Panel 1"
                className="w-full h-auto object-cover aspect-[2/3] opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Background Right */}
            <div className="absolute right-[0%] top-[10%] w-[45%] rounded-xl overflow-hidden brutal-shadow z-20 transition-all duration-500 hover:scale-110 hover:z-40" style={{ transform: "rotate(15deg)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img
                src="https://krita-artists.org/uploads/default/original/3X/8/7/87f226d9cfac630e70e6274047934cda7e5746c2.jpeg"
                alt="Manga Panel 2"
                className="w-full h-auto object-cover aspect-[2/3] opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Center Foreground */}
            <div className="absolute left-[15%] top-[5%] md:left-[22%] md:top-[0%] w-[55%] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-30 transition-transform duration-500 hover:scale-105 hover:z-40" style={{ transform: "rotate(2deg)", border: "2px solid rgba(255,255,255,0.15)" }}>
              <img
                src="https://i.pinimg.com/736x/c6/e0/76/c6e076ed477f83c8717c70921d11ff25.jpg"
                alt="Manga Panel 3"
                className="w-full h-auto object-cover aspect-[2/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Translation Comparison ── */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--manga-primary)" }}>
            Context + Localization
          </h2>
          <p className="text-lg" style={{ color: "var(--manga-text-muted)" }}>
            Generic AI translates words. MangaScribe translates <i>emotion</i>. Our context-aware engine provides rich English and Hindi localizations that preserve the raw intensity of the original scene.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Without Context */}
          <div className="card-brutal p-8 relative flex flex-col justify-between" style={{ borderStyle: "dashed", opacity: 0.8 }}>
            <div>
              <div className="uppercase tracking-wider font-bold text-xs mb-4" style={{ color: "var(--manga-text-muted)" }}>Generic AI Translation</div>
              <p className="font-bold text-xl italic mb-6">"I will exterminate them."</p>
            </div>
            <div className="text-sm font-bold mt-4" style={{ color: "var(--manga-text-muted)" }}>Flat. Unemotional. Generic.</div>
          </div>

          {/* With Context (English) */}
          <div className="card-brutal p-8 relative transform md:-translate-y-4 shadow-xl flex flex-col justify-between" style={{ borderColor: "var(--manga-secondary)" }}>
            <div className="absolute -top-3 -right-3 badge-brutal bg-manga-secondary text-manga-bg" style={{ background: "var(--manga-secondary)", color: "var(--manga-bg)", borderColor: "var(--manga-secondary)" }}>
              English
            </div>
            <div>
              <div className="uppercase tracking-wider font-bold text-xs mb-4" style={{ color: "var(--manga-accent)" }}>MangaScribe (Action / Dark)</div>
              <p className="font-bold text-2xl mb-6 leading-tight">"{DEMO_COMPARISON.contextAware}"</p>
            </div>
            <div className="text-sm font-bold mt-4" style={{ color: "var(--manga-text)" }}>🔥 Punchy. Intense. In-character.</div>
          </div>

          {/* With Context (Hindi) */}
          <div className="card-brutal p-8 relative shadow-xl flex flex-col justify-between" style={{ borderColor: "var(--manga-primary)" }}>
            <div className="absolute -top-3 -right-3 badge-brutal bg-manga-primary text-manga-bg" style={{ background: "var(--manga-primary)", color: "var(--manga-bg)", borderColor: "var(--manga-primary)" }}>
              Hindi
            </div>
            <div>
              <div className="uppercase tracking-wider font-bold text-xs mb-4" style={{ color: "var(--manga-accent)" }}>MangaScribe (Action / Dark)</div>
              <p className="font-bold text-2xl mb-6 leading-tight">"{DEMO_COMPARISON.contextAwareHindi}"</p>
            </div>
            <div className="text-sm font-bold mt-4" style={{ color: "var(--manga-text)" }}>🔥 Powerful Native Localization.</div>
          </div>
        </div>
      </section>

      {/* ── Pipeline Steps ── */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            ⚡ Pipeline Architecture
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.step} className="flex items-center gap-3">
              <div
                className="card-brutal p-4 text-center min-w-[130px]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl mb-1">{step.icon}</div>
                <div
                  className="text-xs font-bold tracking-wider"
                  style={{ color: "var(--manga-red)", fontFamily: "var(--font-mono)" }}
                >
                  {step.step}
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.label}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--manga-gray-dark)" }}>
                  {step.desc}
                </div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="text-2xl font-bold hidden md:block" style={{ color: "var(--manga-red)" }}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            🛠️ Features
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card-brutal p-5">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--manga-gray-dark)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section
        className="px-6 py-12"
        style={{ background: "var(--manga-black)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            🔧 Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "YOLOv8",
              "MangaOCR",
              "Lingo.dev SDK",
              "LaMa Inpainting",
              "FastAPI",
              "Next.js",
              "Tailwind CSS",
              "TypeScript",
              "Pillow",
              "OpenCV",
              "Web Speech API",
            ].map((tech) => (
              <span
                key={tech}
                className="badge-brutal"
                style={{
                  background: "transparent",
                  color: "var(--manga-yellow)",
                  borderColor: "var(--manga-yellow)",
                  fontSize: "0.8rem",
                  padding: "0.3rem 0.8rem",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="px-6 py-16 text-center" style={{ background: "var(--manga-red)" }}>
        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to translate?
        </h2>
        <p className="text-white/80 mb-6 text-lg">
          Drop a manga page and let the AI handle the rest.
        </p>
        <Link
          href="/dashboard"
          className="btn-brutal text-lg px-8 py-4 justify-center inline-flex"
          style={{
            background: "var(--manga-black)",
            color: "white",
            borderColor: "white",
            boxShadow: "4px 4px 0px white",
          }}
        >
          Open Translation Studio
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-8 text-center text-sm"
        style={{ color: "var(--manga-gray-dark)" }}
      >
        <p>
          <span style={{ color: "var(--manga-primary)", fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "0.05em" }}>MANGASCRIBE v2.0</span>
        </p>
      </footer>
    </div>
  );
}

import { Bubble } from "@/lib/api";

export interface DemoPanel {
    id: string;
    title: string;
    series: string;
    tone: string;
    imageUrl: string;
    contextPrompt: string;
    bubbles: Bubble[];
}

export const demoPanels: DemoPanel[] = [
    {
        id: "aot_sample",
        title: "The Rumbling Declaration",
        series: "Attack on Titan",
        tone: "Dark, apocalyptic fury",
        imageUrl: "/demo-assets/aot_panel.jpg",
        contextPrompt:
            "Attack on Titan, late arc. The scene is dark, violent, and apocalyptic. " +
            "The speaker is Eren Jaeger — once a frightened boy, now a merciless avenger " +
            "who has unlocked the power of the Founding Titan. He speaks with cold fury " +
            "and absolute conviction. Preserve the raw, guttural intensity. Do not soften " +
            "the language — this is a declaration of annihilation.",
        bubbles: [
            {
                id: 0,
                bbox: { x1: 50, y1: 30, x2: 250, y2: 120 },
                japanese_text: "この世界から一人残らず駆逐してやる",
                translated_text: "I'll eradicate every last one of them from this world.",
            },
            {
                id: 1,
                bbox: { x1: 300, y1: 150, x2: 480, y2: 230 },
                japanese_text: "自由を求めて前に進み続ける",
                translated_text: "I'll keep moving forward... seeking freedom.",
            },
        ],
    },
    {
        id: "haikyuu_sample",
        title: "The First Spike",
        series: "Haikyuu!!",
        tone: "Electric sports energy",
        imageUrl: "/demo-assets/haikyuu_panel.jpg",
        contextPrompt:
            "Haikyuu!!, early arc. This is a high-energy volleyball scene. " +
            "The speaker is Hinata Shouyou — small in stature but overflowing with determination. " +
            "He speaks with breathless excitement and unwavering resolve. " +
            "Keep the energy electric and the language dynamic.",
        bubbles: [
            {
                id: 0,
                bbox: { x1: 60, y1: 40, x2: 280, y2: 130 },
                japanese_text: "俺はここにいる！！",
                translated_text: "I'M RIGHT HERE!!",
            },
        ],
    },
    {
        id: "dn_sample",
        title: "The First Note",
        series: "Death Note",
        tone: "Cold, intellectual menace",
        imageUrl: "/demo-assets/dn_panel.jpg",
        contextPrompt:
            "Death Note, Chapter 1. The atmosphere is tense and cerebral. " +
            "The speaker is Light Yagami — a genius high school student who has just found " +
            "a supernatural notebook that can kill. He speaks with cold calculation and " +
            "a growing god complex. The dialogue should drip with intellectual arrogance.",
        bubbles: [
            {
                id: 0,
                bbox: { x1: 40, y1: 20, x2: 230, y2: 100 },
                japanese_text: "僕が新世界の神になる",
                translated_text: "I will become the god of this new world.",
            },
            {
                id: 1,
                bbox: { x1: 270, y1: 120, x2: 460, y2: 200 },
                japanese_text: "このノートに名前を書けば…",
                translated_text: "If I write a name in this notebook...",
            },
        ],
    },
];

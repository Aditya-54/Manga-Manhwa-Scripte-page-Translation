import { NextRequest, NextResponse } from "next/server";
import { translateWithLingo, batchTranslateWithLingo } from "@/lib/lingo";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            text,
            texts,
            sourceLocale = "ja",
            targetLocale = "en",
            contextPrompt = "",
        } = body;

        // Batch mode
        if (texts && Array.isArray(texts)) {
            const result = await batchTranslateWithLingo({
                texts,
                sourceLocale,
                targetLocale,
                contextPrompt,
            });

            if (!result.success) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                translations: result.translations,
                engine: "lingo.dev",
            });
        }

        // Single text mode
        if (text) {
            const result = await translateWithLingo({
                text,
                sourceLocale,
                targetLocale,
                contextPrompt,
            });

            if (!result.success) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                original: text,
                translation: result.translation,
                engine: "lingo.dev",
            });
        }

        return NextResponse.json(
            { success: false, error: "No text or texts provided" },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

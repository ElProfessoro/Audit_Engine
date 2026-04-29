import { NextResponse } from "next/server";
import { z } from "zod";
import { scan } from "@/lib/scanner";

// Playwright requiert Node.js — cette route est exclue du build Cloudflare Pages
export const runtime = "nodejs";

const ScanRequestSchema = z.object({
  url: z.string().url("URL invalide"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = ScanRequestSchema.parse(body);

    const result = await scan({ url });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Scan failed:", error);
    return NextResponse.json(
      {
        error: "Scan failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Le scan peut prendre jusqu'à 30s, on donne un timeout généreux
export const maxDuration = 60;

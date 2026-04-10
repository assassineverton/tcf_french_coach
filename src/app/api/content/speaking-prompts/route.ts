import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/** Library prompts for oral practice (user-imported + seed). */
export async function GET() {
  try {
    const rows = await prisma.speakingPromptContent.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    const prompts = rows.map((r) => ({
      id: r.id,
      taskType: r.taskType as "information" | "convince" | "opinion" | string,
      titleFr: r.title,
      promptFr: r.prompt,
      hintsEn: r.hintsEn ?? "",
      timeGuideSec: r.timeGuideSec ?? 150,
      sourceAttribution: r.sourceAttribution,
    }));
    return NextResponse.json({ prompts, source: "library" as const });
  } catch {
    return NextResponse.json({ prompts: [], source: "none" as const }, { status: 503 });
  }
}

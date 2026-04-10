import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getOrCreateUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        mockExams: { orderBy: { takenAt: "desc" }, take: 6 },
        quizAttempts: { orderBy: { createdAt: "desc" }, take: 15 },
        practiceAttempts: { orderBy: { createdAt: "desc" }, take: 40 },
      },
    });

    const lib = await prisma.$transaction([
      prisma.speakingPromptContent.count(),
      prisma.writingPromptContent.count(),
      prisma.readingPassageContent.count(),
      prisma.listeningExerciseContent.count(),
      prisma.grammarDrillContent.count(),
      prisma.vocabularyCardContent.count(),
    ]);

    const skillKeys = ["speaking", "writing", "reading", "listening", "grammar", "vocabulary"] as const;
    const skillBreakdown: Record<string, { attempts: number; avgPct: number | null }> = {};
    for (const s of skillKeys) skillBreakdown[s] = { attempts: 0, avgPct: null };

    for (const a of user?.practiceAttempts ?? []) {
      if (!skillBreakdown[a.skill]) continue;
      skillBreakdown[a.skill]!.attempts++;
    }
    for (const s of skillKeys) {
      const list = (user?.practiceAttempts ?? []).filter((x) => x.skill === s && x.score != null && x.maxScore);
      if (list.length) {
        const pct =
          list.reduce((acc, x) => acc + (x.score! / Math.max(1, x.maxScore!)) * 100, 0) / list.length;
        skillBreakdown[s]!.avgPct = Math.round(pct);
      }
    }

    const recentChart = (user?.quizAttempts ?? []).slice(0, 8).map((q) => ({
      label: q.topic.slice(0, 14),
      pct: Math.round((q.score / Math.max(1, q.total)) * 100),
      date: q.createdAt.toISOString(),
    }));

    return NextResponse.json({
      user,
      libraryCounts: {
        speaking: lib[0],
        writing: lib[1],
        reading: lib[2],
        listening: lib[3],
        grammar: lib[4],
        vocabulary: lib[5],
      },
      skillBreakdown,
      recentQuizChart: recentChart,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Résumé indisponible." }, { status: 503 });
  }
}

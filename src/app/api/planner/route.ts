import { coachApi } from "@/lib/agent/coach";
import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  let userId: string;
  try {
    userId = await getOrCreateUserId();
  } catch {
    return NextResponse.json({ error: "Session indisponible" }, { status: 503 });
  }

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const recentQuizzes = await prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const safeParse = (s: string | null | undefined, fb: unknown[]) => {
    if (!s) return fb;
    try {
      return JSON.parse(s) as unknown[];
    } catch {
      return fb;
    }
  };

  const payload = JSON.stringify({
    examDate: profile?.examDate?.toISOString() ?? null,
    targetLevel: profile?.targetLevel ?? "B2",
    currentEstimate: profile?.currentEstimate ?? "B1",
    dailyMinutes: profile?.dailyMinutes ?? 45,
    strengths: safeParse(profile?.strengthsJson, []),
    weaknesses: safeParse(profile?.weaknessesJson, []),
    recentQuizSummary: recentQuizzes.map((q) => ({
      module: q.module,
      topic: q.topic,
      score: q.score,
      total: q.total,
    })),
  });

  const result = await coachApi.weeklyPlan(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  try {
    await prisma.userProfile.update({
      where: { userId },
      data: { studyPlanWeekly: JSON.stringify(result.data) },
    });
  } catch {
    /* profile may be missing on legacy rows */
  }

  return NextResponse.json({ plan: result.data });
}

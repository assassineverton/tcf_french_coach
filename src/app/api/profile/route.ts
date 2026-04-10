import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const userId = await getOrCreateUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        mockExams: { orderBy: { takenAt: "desc" }, take: 6 },
        writingPieces: { orderBy: { createdAt: "desc" }, take: 5 },
        speakingSessions: { orderBy: { createdAt: "desc" }, take: 5 },
        quizAttempts: { orderBy: { createdAt: "desc" }, take: 10 },
        mistakes: { orderBy: { lastSeenAt: "desc" }, take: 20 },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Base de données indisponible. Configurez DATABASE_URL (voir README)." },
      { status: 503 },
    );
  }
}

const patchSchema = z.object({
  examDate: z.string().optional().nullable(),
  targetLevel: z.string().optional(),
  targetScoreNotes: z.string().optional().nullable(),
  currentEstimate: z.string().optional(),
  dailyMinutes: z.number().int().min(10).max(300).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
});

export async function PATCH(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const json = await req.json();
    const data = patchSchema.parse(json);

    const strengthsJson =
      data.strengths !== undefined ? JSON.stringify(data.strengths) : undefined;
    const weaknessesJson =
      data.weaknesses !== undefined ? JSON.stringify(data.weaknesses) : undefined;

    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        examDate: data.examDate ? new Date(`${data.examDate}T12:00:00`) : undefined,
        targetLevel: data.targetLevel ?? "B2",
        targetScoreNotes: data.targetScoreNotes ?? undefined,
        currentEstimate: data.currentEstimate ?? "B1",
        dailyMinutes: data.dailyMinutes ?? 45,
        strengthsJson: strengthsJson ?? "[]",
        weaknessesJson: weaknessesJson ?? "[]",
      },
      update: {
        ...(data.examDate !== undefined && {
          examDate: data.examDate ? new Date(`${data.examDate}T12:00:00`) : null,
        }),
        ...(data.targetLevel !== undefined && { targetLevel: data.targetLevel }),
        ...(data.targetScoreNotes !== undefined && { targetScoreNotes: data.targetScoreNotes }),
        ...(data.currentEstimate !== undefined && { currentEstimate: data.currentEstimate }),
        ...(data.dailyMinutes !== undefined && { dailyMinutes: data.dailyMinutes }),
        ...(strengthsJson !== undefined && { strengthsJson }),
        ...(weaknessesJson !== undefined && { weaknessesJson }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 503 });
  }
}

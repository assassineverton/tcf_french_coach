import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  module: z.string(),
  topic: z.string(),
  score: z.number().int(),
  total: z.number().int(),
  details: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    await prisma.quizAttempt.create({
      data: {
        userId,
        module: d.module,
        topic: d.topic,
        score: d.score,
        total: d.total,
        detailsJson: d.details ? JSON.stringify(d.details) : undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible d’enregistrer le quiz" }, { status: 503 });
  }
}

import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  skill: z.enum(["reading", "listening"]),
  passageId: z.string(),
  topic: z.string(),
  difficulty: z.string(),
  score: z.number().int(),
  total: z.number().int(),
});

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    if (d.skill === "reading") {
      await prisma.readingAttempt.create({
        data: {
          userId,
          passageId: d.passageId,
          topic: d.topic,
          difficulty: d.difficulty,
          score: d.score,
          total: d.total,
        },
      });
    } else {
      await prisma.listeningAttempt.create({
        data: {
          userId,
          passageId: d.passageId,
          topic: d.topic,
          difficulty: d.difficulty,
          score: d.score,
          total: d.total,
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Indisponible" }, { status: 503 });
  }
}

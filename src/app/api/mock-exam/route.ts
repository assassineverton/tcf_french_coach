import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  section: z.string(),
  score: z.number().int(),
  maxScore: z.number().int(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await prisma.mockExamResult.create({
      data: { userId, ...parsed.data },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Indisponible" }, { status: 503 });
  }
}

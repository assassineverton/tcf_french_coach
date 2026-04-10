import { coachApi } from "@/lib/agent/coach";
import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  prompt: z.string().min(1),
  mode: z.string(),
  text: z.string().min(1).max(20000),
});

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = await getOrCreateUserId();
  } catch {
    return NextResponse.json({ error: "Session indisponible" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = JSON.stringify({
    prompt: parsed.data.prompt,
    mode: parsed.data.mode,
    learnerText: parsed.data.text,
  });

  const result = await coachApi.writingFeedback(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  const data = result.data as Record<string, unknown>;
  await prisma.writingPiece.create({
    data: {
      userId,
      prompt: parsed.data.prompt,
      mode: parsed.data.mode,
      original: parsed.data.text,
      feedbackJson: JSON.stringify(data),
      scoreBand: typeof data.bLevelFit === "object" && data.bLevelFit && "label" in (data.bLevelFit as object)
        ? String((data.bLevelFit as { label?: string }).label ?? "")
        : null,
    },
  });

  return NextResponse.json({ feedback: data });
}

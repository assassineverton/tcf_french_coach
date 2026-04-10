import { coachApi } from "@/lib/agent/coach";
import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  taskType: z.string(),
  prompt: z.string().min(1),
  transcript: z.string().min(1).max(20000),
  timedSeconds: z.number().int().optional().nullable(),
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
    taskType: parsed.data.taskType,
    prompt: parsed.data.prompt,
    transcript: parsed.data.transcript,
    note: "If transcript from speech recognition, mention limits in pronunciation field.",
  });

  const result = await coachApi.speakingFeedback(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  const data = result.data as Record<string, unknown>;
  await prisma.speakingSession.create({
    data: {
      userId,
      taskType: parsed.data.taskType,
      prompt: parsed.data.prompt,
      transcript: parsed.data.transcript,
      feedbackJson: JSON.stringify(data),
      timedSeconds: parsed.data.timedSeconds ?? undefined,
    },
  });

  return NextResponse.json({ feedback: data });
}

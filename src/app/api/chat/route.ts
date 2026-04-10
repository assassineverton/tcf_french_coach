import { coachChat } from "@/lib/agent/coach";
import { buildChatUserContext } from "@/lib/agent/prompts";
import type { CoachMode } from "@/lib/agent/prompts";
import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  mode: z.enum(["tutor", "examiner", "drill"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(12000),
    }),
  ),
});

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = await getOrCreateUserId();
  } catch {
    return NextResponse.json({ error: "Session indisponible (base de données ?)" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { mode, messages } = parsed.data;
  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  let weaknesses: string[] = [];
  let strengths: string[] = [];
  try {
    weaknesses = profile?.weaknessesJson ? JSON.parse(profile.weaknessesJson) : [];
    strengths = profile?.strengthsJson ? JSON.parse(profile.strengthsJson) : [];
  } catch {
    /* ignore */
  }

  const userContext = buildChatUserContext({
    examDate: profile?.examDate?.toISOString() ?? null,
    targetLevel: profile?.targetLevel,
    currentEstimate: profile?.currentEstimate,
    weaknesses,
    strengths,
  });

  const result = await coachChat({
    mode: mode as CoachMode,
    messages,
    userContext,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    await prisma.coachMessage.createMany({
      data: [
        { userId, role: "user", content: lastUser.content, mode },
        { userId, role: "assistant", content: result.text, mode },
      ],
    });
  }

  return NextResponse.json({ reply: result.text });
}

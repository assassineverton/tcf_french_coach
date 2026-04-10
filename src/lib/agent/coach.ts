import OpenAI from "openai";
import {
  REWRITE_B2_INSTRUCTIONS,
  SPEAKING_FEEDBACK_INSTRUCTIONS,
  SYSTEM_PROMPTS,
  WRITING_FEEDBACK_INSTRUCTIONS,
  WEEKLY_PLAN_INSTRUCTIONS,
  type CoachMode,
} from "./prompts";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function coachChat(opts: {
  mode: CoachMode;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  userContext?: string;
}) {
  const client = getOpenAI();
  if (!client) {
    return {
      ok: false as const,
      error: "OPENAI_API_KEY manquant. Ajoutez-le dans .env pour activer le tuteur IA.",
    };
  }
  const system = SYSTEM_PROMPTS[opts.mode];
  const ctx = opts.userContext ? `\n\n${opts.userContext}` : "";
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: system + ctx },
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  const text = completion.choices[0]?.message?.content ?? "";
  return { ok: true as const, text };
}

export async function jsonCoachInstruction(opts: {
  instruction: string;
  userPayload: string;
}) {
  const client = getOpenAI();
  if (!client) {
    return { ok: false as const, error: "OPENAI_API_KEY manquant." };
  }
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: opts.instruction },
      { role: "user", content: opts.userPayload },
    ],
  });
  const text = completion.choices[0]?.message?.content ?? "{}";
  try {
    return { ok: true as const, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, error: "Réponse IA non JSON." };
  }
}

export const coachApi = {
  writingFeedback: (payload: string) =>
    jsonCoachInstruction({ instruction: WRITING_FEEDBACK_INSTRUCTIONS, userPayload: payload }),
  speakingFeedback: (payload: string) =>
    jsonCoachInstruction({ instruction: SPEAKING_FEEDBACK_INSTRUCTIONS, userPayload: payload }),
  rewriteB2: (payload: string) =>
    jsonCoachInstruction({ instruction: REWRITE_B2_INSTRUCTIONS, userPayload: payload }),
  weeklyPlan: (payload: string) =>
    jsonCoachInstruction({ instruction: WEEKLY_PLAN_INSTRUCTIONS, userPayload: payload }),
};

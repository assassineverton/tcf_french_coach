import { coachApi } from "@/lib/agent/coach";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1).max(12000),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await coachApi.rewriteB2(JSON.stringify({ text: parsed.data.text }));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json({ result: result.data });
}

import { prisma } from "@/lib/db";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const userId = await getOrCreateUserId();
    const items = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Indisponible" }, { status: 503 });
  }
}

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  sourceId: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const parsed = postSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const b = await prisma.bookmark.create({
      data: { userId, ...parsed.data },
    });
    return NextResponse.json({ bookmark: b });
  } catch {
    return NextResponse.json({ error: "Impossible d’enregistrer" }, { status: 503 });
  }
}

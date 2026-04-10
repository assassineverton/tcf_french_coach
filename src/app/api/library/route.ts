import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      speaking,
      writing,
      reading,
      listening,
      grammar,
      vocab,
      phrases,
      batches,
    ] = await Promise.all([
      prisma.speakingPromptContent.count(),
      prisma.writingPromptContent.count(),
      prisma.readingPassageContent.count(),
      prisma.listeningExerciseContent.count(),
      prisma.grammarDrillContent.count(),
      prisma.vocabularyCardContent.count(),
      prisma.phraseBankContent.count(),
      prisma.contentImportBatch.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          createdAt: true,
          format: true,
          sourceLabel: true,
          originalFileName: true,
          itemCountsJson: true,
        },
      }),
    ]);

    return NextResponse.json({
      counts: {
        speaking,
        writing,
        reading,
        listening,
        grammar,
        vocabulary: vocab,
        phrases,
      },
      batches,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bibliothèque indisponible." }, { status: 503 });
  }
}

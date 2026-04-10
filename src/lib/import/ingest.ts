import { prisma } from "@/lib/db";
import type { LibraryImportFile } from "./schemas";

export type IngestMeta = {
  userId: string | null;
  format: string;
  originalFileName: string | null;
  rightsDeclaration: string;
  sourceLabel: string;
  notes?: string | null;
};

function tagsJson(tags: string[]) {
  return JSON.stringify(tags);
}

export async function ingestLibraryPayload(data: LibraryImportFile, meta: IngestMeta) {
  const counts = {
    speakingPrompts: data.speakingPrompts.length,
    writingPrompts: data.writingPrompts.length,
    readingPassages: data.readingPassages.length,
    listeningExercises: data.listeningExercises.length,
    grammarDrills: data.grammarDrills.length,
    vocabularyCards: data.vocabularyCards.length,
    phraseBank: data.phraseBank.length,
  };

  const batch = await prisma.contentImportBatch.create({
    data: {
      userId: meta.userId,
      format: meta.format,
      originalFileName: meta.originalFileName,
      rightsDeclaration: meta.rightsDeclaration,
      sourceLabel: meta.sourceLabel,
      notes: meta.notes ?? null,
      itemCountsJson: JSON.stringify(counts),
    },
  });

  const defaultSource = data.sourceAttribution;
  const defaultRights = data.rightsNote ?? null;

  for (const s of data.speakingPrompts) {
    await prisma.speakingPromptContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: s.sourceAttribution ?? defaultSource,
        rightsNote: s.rightsNote ?? defaultRights,
        externalRef: s.externalRef ?? null,
        title: s.title,
        prompt: s.prompt,
        taskType: s.taskType,
        level: s.level,
        topic: s.topic,
        difficulty: s.difficulty,
        timeGuideSec: s.timeGuideSec ?? null,
        hintsEn: s.hintsEn ?? null,
        tagsJson: tagsJson(s.tags ?? []),
      },
    });
  }

  for (const w of data.writingPrompts) {
    await prisma.writingPromptContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: w.sourceAttribution ?? defaultSource,
        rightsNote: w.rightsNote ?? defaultRights,
        externalRef: w.externalRef ?? null,
        title: w.title,
        instruction: w.instruction,
        mode: w.mode,
        genre: w.genre,
        wordTarget: w.wordTarget ?? null,
        level: w.level,
        topic: w.topic,
        difficulty: w.difficulty,
        tagsJson: tagsJson(w.tags ?? []),
      },
    });
  }

  for (const r of data.readingPassages) {
    const passage = await prisma.readingPassageContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: r.sourceAttribution ?? defaultSource,
        rightsNote: r.rightsNote ?? defaultRights,
        externalRef: r.externalRef ?? null,
        title: r.title,
        body: r.body,
        level: r.level,
        topic: r.topic,
        difficulty: r.difficulty,
        tagsJson: tagsJson(r.tags ?? []),
      },
    });
    let order = 0;
    for (const q of r.questions) {
      await prisma.readingQuestionContent.create({
        data: {
          passageId: passage.id,
          prompt: q.prompt,
          choicesJson: JSON.stringify(q.choices),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          trapTip: q.trapTip ?? null,
          order: order++,
        },
      });
    }
  }

  for (const l of data.listeningExercises) {
    const ex = await prisma.listeningExerciseContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: l.sourceAttribution ?? defaultSource,
        rightsNote: l.rightsNote ?? defaultRights,
        externalRef: l.externalRef ?? null,
        title: l.title,
        transcript: l.transcript,
        audioUrl: l.audioUrl ?? null,
        audioNote: l.audioNote ?? null,
        level: l.level,
        topic: l.topic,
        difficulty: l.difficulty,
        tagsJson: tagsJson(l.tags ?? []),
      },
    });
    let order = 0;
    for (const q of l.questions) {
      await prisma.listeningQuestionContent.create({
        data: {
          exerciseId: ex.id,
          prompt: q.prompt,
          choicesJson: JSON.stringify(q.choices),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          trapTip: q.trapTip ?? null,
          order: order++,
        },
      });
    }
  }

  for (const g of data.grammarDrills) {
    await prisma.grammarDrillContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: g.sourceAttribution ?? defaultSource,
        rightsNote: g.rightsNote ?? defaultRights,
        externalRef: g.externalRef ?? null,
        topic: g.topic,
        prompt: g.prompt,
        answer: g.answer,
        alternativesJson: JSON.stringify(g.alternatives ?? []),
        explanationFr: g.explanationFr,
        explanationEn: g.explanationEn,
        level: g.level,
        tagsJson: tagsJson(g.tags ?? []),
      },
    });
  }

  for (const v of data.vocabularyCards) {
    await prisma.vocabularyCardContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: v.sourceAttribution ?? defaultSource,
        rightsNote: v.rightsNote ?? defaultRights,
        deckName: v.deckName,
        front: v.front,
        back: v.back,
        context: v.context ?? null,
        level: v.level,
        tagsJson: tagsJson(v.tags ?? []),
      },
    });
  }

  for (const p of data.phraseBank) {
    await prisma.phraseBankContent.create({
      data: {
        importBatchId: batch.id,
        sourceAttribution: p.sourceAttribution ?? defaultSource,
        rightsNote: p.rightsNote ?? defaultRights,
        phraseFr: p.phraseFr,
        phraseEn: p.phraseEn,
        category: p.category,
        register: p.register,
        tagsJson: tagsJson(p.tags ?? []),
      },
    });
  }

  return { batchId: batch.id, counts };
}

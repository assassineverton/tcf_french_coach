import { z } from "zod";

/** Master import format for user-authorized TCF materials (JSON). */
export const questionSchema = z.object({
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
  trapTip: z.string().optional(),
});

export const speakingPromptSchema = z.object({
  title: z.string().min(1),
  prompt: z.string().min(1),
  taskType: z.string().min(1),
  level: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.string().optional().default("B2"),
  timeGuideSec: z.number().int().positive().optional(),
  hintsEn: z.string().optional(),
  externalRef: z.string().optional(),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const writingPromptSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  mode: z.string().min(1),
  genre: z.string().optional().default("article"),
  wordTarget: z.string().optional(),
  level: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.string().optional().default("B2"),
  externalRef: z.string().optional(),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const readingPassageSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  level: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.string().min(1),
  externalRef: z.string().optional(),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  questions: z.array(questionSchema).min(1),
});

export const listeningExerciseSchema = z.object({
  title: z.string().min(1),
  transcript: z.string().min(1),
  audioUrl: z.string().optional().nullable(),
  audioNote: z.string().optional(),
  level: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.string().min(1),
  externalRef: z.string().optional(),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  questions: z.array(questionSchema).min(1),
});

export const grammarDrillSchema = z.object({
  topic: z.string().min(1),
  prompt: z.string().min(1),
  answer: z.string().min(1),
  alternatives: z.array(z.string()).optional().default([]),
  explanationFr: z.string().min(1),
  explanationEn: z.string().min(1),
  level: z.string().optional().default("B2"),
  externalRef: z.string().optional(),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const vocabularyCardSchema = z.object({
  deckName: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
  context: z.string().optional(),
  level: z.string().optional().default("B2"),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const phraseBankEntrySchema = z.object({
  phraseFr: z.string().min(1),
  phraseEn: z.string().min(1),
  category: z.string().min(1),
  register: z.string().optional().default("neutral"),
  sourceAttribution: z.string().optional(),
  rightsNote: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const libraryImportFileSchema = z.object({
  version: z.number().int().optional().default(1),
  sourceLabel: z.string().min(1),
  sourceAttribution: z.string().min(1),
  rightsNote: z.string().optional(),
  speakingPrompts: z.array(speakingPromptSchema).optional().default([]),
  writingPrompts: z.array(writingPromptSchema).optional().default([]),
  readingPassages: z.array(readingPassageSchema).optional().default([]),
  listeningExercises: z.array(listeningExerciseSchema).optional().default([]),
  grammarDrills: z.array(grammarDrillSchema).optional().default([]),
  vocabularyCards: z.array(vocabularyCardSchema).optional().default([]),
  phraseBank: z.array(phraseBankEntrySchema).optional().default([]),
});

export type LibraryImportFile = z.infer<typeof libraryImportFileSchema>;

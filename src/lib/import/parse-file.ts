import { libraryImportFileSchema, type LibraryImportFile } from "./schemas";

/** Extract first fenced ```json ... ``` block from Markdown. */
export function extractJsonFromMarkdown(md: string): string | null {
  const m = md.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return m?.[1]?.trim() ?? null;
}

export function parseLibraryJson(raw: string): LibraryImportFile {
  const data = JSON.parse(raw) as unknown;
  return libraryImportFileSchema.parse(data);
}

/** Plain text: treat whole file as a single reading passage (user-provided study text). */
export function parsePlainTextAsReading(
  body: string,
  meta: { sourceLabel: string; sourceAttribution: string; rightsNote?: string },
): LibraryImportFile {
  const title = body.split("\n")[0]?.slice(0, 120) || "Texte importé";
  return libraryImportFileSchema.parse({
    sourceLabel: meta.sourceLabel,
    sourceAttribution: meta.sourceAttribution,
    rightsNote: meta.rightsNote,
    readingPassages: [
      {
        title,
        body: body.trim(),
        level: "B2",
        topic: "import",
        difficulty: "B2",
        questions: [
          {
            prompt: "Après lecture : quelle est l’idée principale ? (ajustez les questions dans un fichier JSON pour un contrôle précis.)",
            choices: [
              "Le texte sert de support d’étude importé par l’utilisateur",
              "Le texte interdit la reproduction",
              "Le texte est une publicité",
              "Le texte est vide",
            ],
            correctIndex: 0,
            explanation: "Import texte brut : enrichissez avec un JSON structuré pour des QCM réels.",
          },
        ],
      },
    ],
  });
}

/** Minimal CSV: columns type,title,prompt,taskType,level,topic,difficulty */
export function parseSpeakingCsv(csv: string, defaults: { sourceLabel: string; sourceAttribution: string }): LibraryImportFile {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV vide ou en-tête manquant");
  const headers = lines[0]!.split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);
  const speakingPrompts = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = cols[j] ?? "";
    });
    const type = row["type"] || "speaking";
    if (type !== "speaking") continue;
    speakingPrompts.push({
      title: row["title"] || `Ligne ${i}`,
      prompt: row["prompt"] || "",
      taskType: row["tasktype"] || row["task_type"] || "opinion",
      level: row["level"] || "B2",
      topic: row["topic"] || "general",
      difficulty: row["difficulty"] || "B2",
      timeGuideSec: row["timeguidesec"] ? Number(row["timeguidesec"]) : undefined,
      hintsEn: row["hintsen"] || undefined,
      tags: row["tags"] ? row["tags"].split(";").map((t) => t.trim()) : [],
    });
  }
  const filtered = speakingPrompts.filter((p) => p.prompt.length > 0);
  if (!filtered.length) throw new Error("Aucune ligne « speaking » valide (colonne prompt requise).");
  return libraryImportFileSchema.parse({
    sourceLabel: defaults.sourceLabel,
    sourceAttribution: defaults.sourceAttribution,
    speakingPrompts: filtered,
  });
}

export function parseImportFile(
  contents: string,
  fileName: string,
): { format: string; data: LibraryImportFile } {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) {
    return { format: "json", data: parseLibraryJson(contents) };
  }
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
    const block = extractJsonFromMarkdown(contents);
    if (block) return { format: "markdown+json", data: parseLibraryJson(block) };
    throw new Error(
      "Markdown sans bloc ```json```. Ajoutez un bloc JSON conforme au schéma, ou importez un .json.",
    );
  }
  if (lower.endsWith(".csv")) {
    return {
      format: "csv",
      data: parseSpeakingCsv(contents, {
        sourceLabel: "CSV import",
        sourceAttribution: "Fichier CSV utilisateur",
      }),
    };
  }
  if (lower.endsWith(".txt")) {
    return {
      format: "text",
      data: parsePlainTextAsReading(contents, {
        sourceLabel: "Texte importé",
        sourceAttribution: "Fichier texte utilisateur",
      }),
    };
  }
  throw new Error("Extension non prise en charge. Utilisez .json, .csv, .md ou .txt.");
}

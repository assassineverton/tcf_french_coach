import { ingestLibraryPayload } from "@/lib/import/ingest";
import { parseImportFile, parseLibraryJson } from "@/lib/import/parse-file";
import { getOrCreateUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  rightsDeclaration: z.string().min(20, "Attestation de droits requise (20 caractères min)."),
  sourceLabel: z.string().min(2),
  notes: z.string().optional(),
  rawJson: z.string().min(2),
});

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = await getOrCreateUserId();
  } catch {
    return NextResponse.json({ error: "Base de données / session indisponible." }, { status: 503 });
  }

  const ct = req.headers.get("content-type") || "";

  try {
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      const rightsDeclaration = String(form.get("rightsDeclaration") || "");
      const sourceLabel = String(form.get("sourceLabel") || "");
      const notes = form.get("notes") ? String(form.get("notes")) : null;

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
      }
      if (rightsDeclaration.length < 20) {
        return NextResponse.json({ error: "Attestation de droits trop courte." }, { status: 400 });
      }
      if (sourceLabel.length < 2) {
        return NextResponse.json({ error: "Libellé de source requis." }, { status: 400 });
      }

      const text = await file.text();
      const { format, data } = parseImportFile(text, file.name);
      const result = await ingestLibraryPayload(data, {
        userId,
        format,
        originalFileName: file.name,
        rightsDeclaration,
        sourceLabel,
        notes,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const data = parseLibraryJson(parsed.rawJson);
    const result = await ingestLibraryPayload(data, {
      userId,
      format: "json-paste",
      originalFileName: null,
      rightsDeclaration: parsed.rightsDeclaration,
      sourceLabel: parsed.sourceLabel,
      notes: parsed.notes ?? null,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Import impossible";
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

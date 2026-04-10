import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { parseLibraryJson } from "../src/lib/import/parse-file";
import { ingestLibraryPayload } from "../src/lib/import/ingest";

const prisma = new PrismaClient();

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: "demo@tcf-coach.local" },
    update: {},
    create: {
      email: "demo@tcf-coach.local",
      name: "Apprenant·e démo",
      profile: {
        create: {
          examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
          targetLevel: "B2",
          currentEstimate: "B1+",
          dailyMinutes: 50,
          streakDays: 5,
          weaknessesJson: JSON.stringify(["subjonctif", "cohérence orale"]),
          strengthsJson: JSON.stringify(["compréhension écrite"]),
        },
      },
    },
    include: { profile: true },
  });

  await prisma.mockExamResult.deleteMany({ where: { userId: demo.id } });
  await prisma.mockExamResult.createMany({
    data: [
      { userId: demo.id, section: "Expression écrite", score: 12, maxScore: 20 },
      { userId: demo.id, section: "Expression orale", score: 10, maxScore: 20 },
    ],
  });

  const libCount = await prisma.speakingPromptContent.count();
  if (libCount === 0) {
    const raw = readFileSync(path.join(process.cwd(), "prisma/data/demo-authorized-library.json"), "utf8");
    const data = parseLibraryJson(raw);
    const { batchId, counts } = await ingestLibraryPayload(data, {
      userId: demo.id,
      format: "seed-json",
      originalFileName: "demo-authorized-library.json",
      rightsDeclaration:
        "J’atteste que le contenu de démonstration est autorisé pour un usage local par le détenteur des droits du dépôt (voir README).",
      sourceLabel: data.sourceLabel,
      notes: "Seed initial — remplacez par vos imports autorisés.",
    });
    console.log("Bibliothèque démo importée :", batchId, counts);
  } else {
    console.log("Bibliothèque non vide — seed contenu ignoré.");
  }

  console.log("Seed OK — utilisateur démo :", demo.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

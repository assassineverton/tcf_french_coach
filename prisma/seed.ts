import { PrismaClient } from "@prisma/client";

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
          weaknessesJson: JSON.stringify(["subjonctif", "coherence orale"]),
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

  console.log("Seed OK — utilisateur démo :", demo.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

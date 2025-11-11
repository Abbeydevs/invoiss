import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.template.upsert({
    where: { id: "classic" },
    update: {},
    create: {
      id: "classic",
      name: "Classic",
      isDefault: true,
      isPremium: false,
      design: {
        layout: "classic-v1",
      },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "modern" },
    update: {},
    create: {
      id: "modern",
      name: "Modern",
      isDefault: false,
      isPremium: false,
      design: {
        layout: "modern-v1",
      },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "premium-elegant" },
    update: {},
    create: {
      id: "premium-elegant",
      name: "Elegant (Pro)",
      isDefault: false,
      isPremium: true,
      design: {
        layout: "elegant-v1",
      },
      userId: null,
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

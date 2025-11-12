import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.template.upsert({
    where: { id: "classic" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1762949407/classic-preview_xj9cqg.png",
    },
    create: {
      id: "classic",
      name: "Classic",
      isDefault: true,
      isPremium: false,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1762949407/classic-preview_xj9cqg.png",
      design: { layout: "classic-v1" },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "modern" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1762949477/modern-preview_ktyoh7.png",
    },
    create: {
      id: "modern",
      name: "Modern",
      isDefault: false,
      isPremium: false,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1762949477/modern-preview_ktyoh7.png",
      design: { layout: "modern-v1" },
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
      design: { layout: "elegant-v1" },
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

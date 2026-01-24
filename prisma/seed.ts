import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  try {
    await prisma.template.delete({
      where: { id: "premium-elegant" },
    });
    console.log("Cleaned up old 'premium-elegant' template.");
  } catch (e) {
    console.log(
      "'premium-elegant' template does not exist, no cleanup needed.",
      e,
    );
  }

  await prisma.template.upsert({
    where: { id: "custom" },
    update: {},
    create: {
      id: "custom",
      name: "Custom (Default)",
      isDefault: true,
      isPremium: false,
      design: { layout: "classic-v1" },
      userId: null,
    },
  });

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
    where: { id: "elegant" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265042/inv-1_cleek4.png",
    },
    create: {
      id: "elegant",
      name: "Elegant",
      isDefault: false,
      isPremium: true,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265042/inv-1_cleek4.png",
      design: { layout: "elegant-v1" },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "executive" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265042/inv-2_lssxy7.png",
    },
    create: {
      id: "executive",
      name: "Executive",
      isDefault: false,
      isPremium: true,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265042/inv-2_lssxy7.png",
      design: { layout: "executive-v1" },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "prestige" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265058/inv-3_tphtvk.png",
    },
    create: {
      id: "prestige",
      name: "Prestige",
      isDefault: false,
      isPremium: true,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265058/inv-3_tphtvk.png",
      design: { layout: "prestige-v1" },
      userId: null,
    },
  });

  await prisma.template.upsert({
    where: { id: "summit" },
    update: {
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265058/inv-4_yrpevz.png",
    },
    create: {
      id: "summit",
      name: "Summit",
      isDefault: false,
      isPremium: true,
      thumbnail:
        "https://res.cloudinary.com/dvhbcih9v/image/upload/v1769265058/inv-4_yrpevz.png",
      design: { layout: "summit-v1" },
      userId: null,
    },
  });

  const adminEmail = "admin@invoiss.com";
  const adminPassword = await hash("Admin123!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      planType: "PRO",
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
      planType: "PRO",
      accountType: "COMPANY",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "Super",
          lastName: "Admin",
          businessName: "Invoiss HQ",
        },
      },
    },
  });

  console.log(`Created Admin User: ${adminUser.email}`);
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

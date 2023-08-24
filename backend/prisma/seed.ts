import { PrismaClient } from "@prisma/client";
import userData from "./data/users.json";
const prisma = new PrismaClient();

const seedData = async () => {
  const userIds = userData.map((user) => user.id);
  await prisma.user.deleteMany({ where: { id: { notIn: userIds } } });

  for (let i = 0; i < userData.length; i++) {
    await prisma.user.upsert({
      where: {
        id: userData[i].id,
      },
      update: {
        name: userData[i].name,
        email: userData[i].email,
        password: userData[i].password,
        admin: userData[i].admin,
      },
      create: {
        id: userData[i].id,
        name: userData[i].name,
        email: userData[i].email,
        password: userData[i].password,
        admin: userData[i].admin,
      },
    });
  }
};

export default function seed() {
  return seedData()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

seed();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function checkConnection() {
  try {
    // Perform a simple query, such as retrieving the first record from a table
    await prisma.$queryRaw`SELECT 1`;
    console.log("Prisma connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

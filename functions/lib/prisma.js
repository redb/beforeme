import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

let prismaClient = null;

export function getPrismaClient(env) {
  if (prismaClient) {
    return prismaClient;
  }

  const url = String(env?.DATABASE_URL || env?.PRISMA_ACCELERATE_URL || '').trim();
  if (!url) {
    throw new Error('DATABASE_URL is missing');
  }

  const base = new PrismaClient({
    datasources: {
      db: { url }
    }
  });
  prismaClient = base.$extends(withAccelerate());

  return prismaClient;
}

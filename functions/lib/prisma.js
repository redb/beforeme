import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { PrismaClient as PrismaClientNode } from '@prisma/client';
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

  const usesAccelerate = url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
  const Client = usesAccelerate ? PrismaClientEdge : PrismaClientNode;
  const base = new Client({
    datasources: {
      db: { url }
    }
  });
  prismaClient = usesAccelerate ? base.$extends(withAccelerate()) : base;

  return prismaClient;
}

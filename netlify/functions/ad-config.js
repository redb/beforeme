import { PrismaClient } from '@prisma/client';

let prismaClient = null;
const CONFIG_KEY = 'ad_config';

function getPrismaClient() {
  const url = process.env.DATABASE_URL || process.env.PRISMA_ACCELERATE_URL || '';
  if (!url) throw new Error('DATABASE_URL is missing');

  if (!prismaClient) {
    prismaClient = new PrismaClient({ datasources: { db: { url } } });
  }

  return prismaClient;
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(payload)
  };
}

function defaultConfig() {
  return {
    mode: 'label',
    label: 'Proposé par AvantMoi.com',
    html: '',
    imageUrl: '',
    linkUrl: ''
  };
}

function isAuthorized(event) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false;

  const token = event.headers?.['x-admin-token'] || event.headers?.['X-Admin-Token'] || '';
  return token === expected;
}

export const handler = async (event) => {
  try {
    const client = getPrismaClient();

    if (event.httpMethod === 'GET') {
      const row = await client.appConfig.findUnique({ where: { key: CONFIG_KEY } });
      return json(200, row?.value || defaultConfig());
    }

    if (event.httpMethod === 'PUT') {
      if (!isAuthorized(event)) {
        return json(401, { error: 'Unauthorized' });
      }

      const payload = JSON.parse(event.body || '{}');
      const value = {
        mode: String(payload.mode || 'label'),
        label: String(payload.label || 'Proposé par AvantMoi.com'),
        html: String(payload.html || ''),
        imageUrl: String(payload.imageUrl || ''),
        linkUrl: String(payload.linkUrl || '')
      };

      await client.appConfig.upsert({
        where: { key: CONFIG_KEY },
        create: { key: CONFIG_KEY, value },
        update: { value }
      });

      return json(200, { ok: true, value });
    }

    return json(405, { error: 'Method not allowed' });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'internal_error' });
  }
};

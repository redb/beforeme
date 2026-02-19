import { PrismaClient } from '@prisma/client';

let prismaClient = null;

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

function isAuthorized(event) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false;
  const token = event.headers?.['x-admin-token'] || event.headers?.['X-Admin-Token'] || '';
  return token === expected;
}

function parseYear(raw) {
  if (!raw) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
}

export const handler = async (event) => {
  try {
    if (!isAuthorized(event)) {
      return json(401, { error: 'Unauthorized' });
    }

    const client = getPrismaClient();

    if (event.httpMethod === 'GET') {
      const year = parseYear(event.queryStringParameters?.year);
      const where = year ? { year, country: 'FR' } : { country: 'FR' };

      const rows = await client.eventCache.findMany({
        where,
        orderBy: [{ year: 'desc' }, { updatedAt: 'desc' }],
        take: 300,
        select: {
          year: true,
          country: true,
          lang: true,
          eventQid: true,
          title: true,
          fact: true,
          sourceUrl: true,
          updatedAt: true
        }
      });

      return json(200, { items: rows });
    }

    if (event.httpMethod === 'DELETE') {
      const year = parseYear(event.queryStringParameters?.year);
      const eventQid = String(event.queryStringParameters?.eventQid || '');
      const lang = String(event.queryStringParameters?.lang || 'fr');

      if (!year || !eventQid) {
        return json(400, { error: 'year and eventQid are required' });
      }

      await client.eventCache.delete({
        where: {
          year_country_lang_eventQid: {
            year,
            country: 'FR',
            lang,
            eventQid
          }
        }
      });

      return json(200, { ok: true });
    }

    return json(405, { error: 'Method not allowed' });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'internal_error' });
  }
};

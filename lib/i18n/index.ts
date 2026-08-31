import { tStatic, Locale } from './static';
import { prisma } from '@/lib/db'; // your prisma client

export async function t(key: string, locale: Locale, namespace: string = 'ui') {
  // 1. Try DB override first (for dynamic/admin-editable)
  const db = await prisma.uiTranslation.findUnique({ where: { key_locale: { key, locale } } });
  if(db) return db.value;

  // 2. Fallback to static JSON
  return tStatic(key, locale);
}

export async function getRequirementInLocale(reqId: string, locale: Locale) {
  const tr = await prisma.requirementTranslation.findUnique({
    where: { requirementId_locale: { requirementId: reqId, locale } }
  });
  return tr;
}
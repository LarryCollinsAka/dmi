export type Locale = "en" | "fr";

const dict: Record<string, Record<Locale, string>> = {
  "upload.title": { en: "Upload Tender Document", fr: "Téléverser le Document" },
  "upload.drop": { en: "Drop your RFP PDF here", fr: "Déposez votre DAO PDF ici" },
};

export async function t(key: string, locale: Locale, namespace: string = 'ui') {
  // For MVP demo: no DB override, just static fallback
  // Later you can add UiTranslation model to schema if needed
  return dict[key]?.[locale] || key;
}

export function getLocaleFromSearchParams(sp: any): Locale {
  return sp?.locale === "fr"? "fr" : "en";
}
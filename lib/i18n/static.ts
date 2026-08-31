import en from './static/en.json';
import fr from './static/fr.json';

export type Locale = 'en' | 'fr';
const dicts = { en, fr };

export function tStatic(key: string, locale: Locale, vars?: Record<string,string>) {
  let str = dicts[locale][key as keyof typeof en] || key;
  if(vars) Object.entries(vars).forEach(([k,v]) => str = str.replace(`{${k}}`, v));
  return str;
}
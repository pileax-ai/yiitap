import languages from './generate/config/languages.json'

export const SupportLanguages = languages
  .filter((item) => item.supported)
  .map((item) => {
    return {
      label: item.label,
      value: item.value,
      subLabel: item.prompt_name,
    }
  })

export const DEFAULT_LANG: LangId = 'en-US'

export const normalizeLang = (input?: string): LangId => {
  if (!input) return DEFAULT_LANG

  const key = input.replace('_', '-').toLowerCase()

  if (LANGUAGE_ALIAS_MAP[key]) {
    return LANGUAGE_ALIAS_MAP[key]
  }

  // 2. Try shot（如 zh-HK → zh）
  const short = key.split('-')[0]
  if (LANGUAGE_ALIAS_MAP[short]) {
    return LANGUAGE_ALIAS_MAP[short]
  }

  // 3. fallback
  return DEFAULT_LANG
}

export type LangId =
  | 'de-DE'
  | 'en-US'
  | 'es-ES'
  | 'fa-IR'
  | 'fr-FR'
  | 'hi-IN'
  | 'id-ID'
  | 'it-IT'
  | 'ja-JP'
  | 'ko-KR'
  | 'pl-PL'
  | 'pt-BR'
  | 'ro-RO'
  | 'ru-RU'
  | 'sl-SI'
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'vi-VN'
  | 'zh-Hans'
  | 'zh-Hant'

export const LANGUAGE_ALIAS_MAP: Record<string, LangId> = {
  de: 'de-DE',
  'de-de': 'de-DE',

  en: 'en-US',
  'en-gb': 'en-US',
  'en-us': 'en-US',
  'en-us-posix': 'en-US',

  es: 'es-ES',
  'es-es': 'es-ES',

  fa: 'fa-IR',
  'fa-ir': 'fa-IR',

  fr: 'fr-FR',
  'fr-fr': 'fr-FR',

  hi: 'hi-IN',
  'hi-in': 'hi-IN',

  id: 'id-ID',
  'id-id': 'id-ID',

  it: 'it-IT',
  'it-it': 'it-IT',

  ja: 'ja-JP',
  'ja-jp': 'ja-JP',

  ko: 'ko-KR',
  'ko-kr': 'ko-KR',

  pl: 'pl-PL',
  'pl-pl': 'pl-PL',

  pt: 'pt-BR',
  'pt-br': 'pt-BR',

  ro: 'ro-RO',
  'ro-ro': 'ro-RO',

  ru: 'ru-RU',
  'ru-ru': 'ru-RU',

  sl: 'sl-SI',
  'sl-si': 'sl-SI',

  th: 'th-TH',
  'th-th': 'th-TH',

  tr: 'tr-TR',
  'tr-tr': 'tr-TR',

  uk: 'uk-UA',
  'uk-ua': 'uk-UA',

  vi: 'vi-VN',
  'vi-vn': 'vi-VN',

  zh: 'zh-Hans',
  'zh-cn': 'zh-Hans',
  'zh-hans': 'zh-Hans',
  'zh-sg': 'zh-Hans',

  'zh-hant': 'zh-Hant',
  'zh-hk': 'zh-Hant',
  'zh-mo': 'zh-Hant',
  'zh-tw': 'zh-Hant',
}

import type { Messages } from './types'
import { normalizeLang } from './languages'

import messageDeDE from './messages/de-DE'
import messageEnUS from './messages/en-US'
import messageFrFR from './messages/fr-FR'
import messageIdID from './messages/id-ID'
import messageJaJP from './messages/ja-JP'
import messageKoKR from './messages/ko-KR'
import messagePlPL from './messages/pl-PL'
import messagePtBR from './messages/pt-BR'
import messageRuRU from './messages/ru-RU'
import messageViVN from './messages/vi-VN'
import messageZhHans from './messages/zh-Hans'
import messageZhHant from './messages/zh-Hant'

const messages: Messages = {
  'de-DE': messageDeDE,
  'en-US': messageEnUS,
  'fr-FR': messageFrFR,
  'id-ID': messageIdID,
  'ja-JP': messageJaJP,
  'ko-KR': messageKoKR,
  'pl-PL': messagePlPL,
  'pt-BR': messagePtBR,
  'ru-RU': messageRuRU,
  'vi-VN': messageViVN,
  'zh-Hans': messageZhHans,
  'zh-Hant': messageZhHant,
}

export const getMessage = (inputLang: string) => {
  const lang = normalizeLang(inputLang)
  return messages[lang]
}

export default messages

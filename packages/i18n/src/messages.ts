import type { Messages } from './types'
import { normalizeLang } from './languages'

import messageEnUS from './messages/en-US'
import messageZhHans from './messages/zh-Hans'
import messageZhHant from './messages/zh-Hant'

const messages: Messages = {
  'en-US': messageEnUS,
  'zh-Hans': messageZhHans,
  'zh-Hant': messageZhHant,
}

export const getMessage = (inputLang: string) => {
  const lang = normalizeLang(inputLang)
  return messages[lang]
}

export default messages

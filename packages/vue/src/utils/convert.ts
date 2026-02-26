/**
 * Convert
 */
import { Editor, generateJSON } from '@tiptap/core'
import { DOMParser } from '@tiptap/pm/model'

export const toJSON = (editor: Editor, html: string): Record<string, any> => {
  return generateJSON(html, editor.extensionManager.extensions)
}

export const htmlToJSON = (
  editor: Editor,
  html: string
): Record<string, any> => {
  const element = document.createElement('div')
  element.innerHTML = html

  const doc = DOMParser.fromSchema(editor.schema).parse(element)

  return doc.toJSON()
}

export const systemKeymap = () => {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  return {
    mod: isMac ? '⌘' : 'Ctrl',
    alt: isMac ? '⌥' : 'Alt',
    shift: isMac ? '⇧' : 'Shift',
    ctrl: isMac ? '⌃' : 'Ctrl',
    meta: isMac ? '⌘' : 'Meta',
  }
}

export const convertShortcut = (shortcut: string) => {
  const keys = shortcut
    ?.split('+')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
  if (!keys || !keys.length) return shortcut

  const map = systemKeymap()
  const converted = keys.map((k) => {
    return map[k as keyof typeof map] ?? k.toUpperCase()
  })

  return converted.join('+')
}

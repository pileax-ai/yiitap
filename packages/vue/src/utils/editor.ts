import type { Editor } from '@tiptap/core'

export const isExtensionInstalled = (
  editor: Editor,
  extensionName: string
): boolean => {
  switch (extensionName) {
    case 'emoji':
      extensionName = 'paragraph'
      break
    case 'diagram':
      extensionName = 'codeBlock'
      break
  }
  return editor.extensionManager.extensions.some(
    (ext) => ext.name === extensionName
  )
}

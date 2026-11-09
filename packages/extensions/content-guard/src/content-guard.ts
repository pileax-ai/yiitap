import { Extension, type SetContentOptions } from '@tiptap/core'
import { sanitizeNodes } from '@yiitap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    contentGuard: {
      /**
       * Safely sanitize JSON content and set it into the editor
       */
      setContentSafely: (
        content: any,
        options?: SetContentOptions
      ) => ReturnType
    }
  }
}

export const ContentGuard = Extension.create({
  name: 'contentGuard',

  addCommands() {
    return {
      setContentSafely:
        (content, options?: SetContentOptions) =>
        ({ editor, commands, dispatch }) => {
          if (!dispatch) {
            return true
          }

          let finalContent = content

          // Automatically sanitize if content is a JSON object
          if (finalContent && typeof finalContent === 'object') {
            finalContent = sanitizeNodes(
              finalContent,
              editor.extensionManager.extensions
            )
          }

          // Delegate to the original editor command execution
          return commands.setContent(finalContent, options)
        },
    }
  },
})

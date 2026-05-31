/**
 * Code Block
 *
 * lowlight: https://github.com/wooorm/lowlight
 * highlight: https://github.com/highlightjs/highlight.js
 * styles: https://github.com/highlightjs/highlight.js/tree/main/src/styles
 * demo: https://highlightjs.org/demo
 */
import { TextSelection } from '@tiptap/pm/state'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'

export const CodeBlock = CodeBlockLowlight.extend<CodeBlockLowlightOptions>({
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      wrap: {
        default: true,
        rendered: false,
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),

      // Handle Tab key for indentation
      Tab: ({ editor }) => {
        const { state, view } = editor
        const { selection, doc } = state
        const { from, to } = selection

        // Check if the selection is inside a code block
        if (state.selection.$from.parent.type.name !== this.name) {
          return false
        }

        const indentString = '    ' // 4 spaces for indentation

        // Case 1: Multi-line selection
        if (from !== to) {
          const startPos = doc.resolve(from).start()
          const endPos = doc.resolve(to).end()
          const text = doc.textBetween(startPos, endPos, '\n')

          const lines = text.split('\n')
          const indentedLines = lines.map((line) => indentString + line)
          const newText = indentedLines.join('\n')

          const tr = state.tr.replaceWith(
            startPos,
            endPos,
            state.schema.text(newText)
          )

          // Keep the selection spanning the same lines
          const diff = newText.length - text.length
          tr.setSelection(TextSelection.create(tr.doc, from, to + diff))

          view.dispatch(tr)
          return true
        }

        // Case 2: Single cursor position
        editor.commands.insertContent(indentString)
        return true
      },

      // Handle Shift-Tab key for unindentation
      'Shift-Tab': ({ editor }) => {
        const { state, view } = editor
        const { selection, doc } = state
        const { from, to } = selection

        if (state.selection.$from.parent.type.name !== this.name) {
          return false
        }

        const indentRegex = /^ {1,4}/ // Match 1 to 4 leading spaces
        const startPos = doc.resolve(from).start()
        const endPos = doc.resolve(to).end()
        const text = doc.textBetween(startPos, endPos, '\n')

        // Case 1: Multi-line selection
        if (from !== to) {
          const lines = text.split('\n')
          let totalRemoved = 0

          const unindentedLines = lines.map((line) => {
            const match = line.match(indentRegex)
            if (match) {
              totalRemoved += match[0].length
              return line.replace(indentRegex, '')
            }
            return line
          })

          if (totalRemoved === 0) return true

          const newText = unindentedLines.join('\n')
          const tr = state.tr.replaceWith(
            startPos,
            endPos,
            state.schema.text(newText)
          )
          tr.setSelection(TextSelection.create(tr.doc, from, to - totalRemoved))

          view.dispatch(tr)
          return true
        }

        // Case 2: Single cursor position (unindent current line)
        const currentLineStart = state.selection.$from.before() + 1
        const currentLineEnd = state.selection.$from.after() - 1
        const lineText = doc.textBetween(currentLineStart, currentLineEnd, '\n')

        const match = lineText.match(indentRegex)
        if (match) {
          const lengthToRemove = match[0].length
          const tr = state.tr.delete(
            currentLineStart,
            currentLineStart + lengthToRemove
          )
          view.dispatch(tr)
          return true
        }

        return true
      },
    }
  },
})

export type { CodeBlockLowlightOptions }

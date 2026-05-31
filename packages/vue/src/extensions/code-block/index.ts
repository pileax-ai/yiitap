/**
 * Code Block
 *
 * lowlight: https://github.com/wooorm/lowlight
 * highlight: https://github.com/highlightjs/highlight.js
 * styles: https://github.com/highlightjs/highlight.js/tree/main/src/styles
 * demo: https://highlightjs.org/demo
 */
import { TextSelection } from '@tiptap/pm/state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import { mermaidGrammar } from './highlight/mermaid'

const lowlight = createLowlight(common)
lowlight.register('mermaid', mermaidGrammar)

import View from './view.vue'

export interface OCodeBlockOptions extends CodeBlockLowlightOptions {
  diagramTheme: string
}

const OCodeBlock = CodeBlockLowlight.extend<OCodeBlockOptions>({
  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      diagramTheme: 'default',
    }
  },

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
        const { selection, tr } = state
        const { $from, $to, from, to } = selection

        if ($from.parent.type.name !== this.name) {
          return false
        }

        const indentString = '    '

        if (from !== to) {
          const startPos = $from.before() + 1
          const endPos = $to.after() - 1
          const text = state.doc.textBetween(startPos, endPos, '\n')

          const lines = text.split('\n')
          const indentedLines = lines.map((line) => indentString + line)
          const newText = indentedLines.join('\n')

          const newTr = tr.replaceWith(
            startPos,
            endPos,
            state.schema.text(newText)
          )
          const diff = newText.length - text.length

          newTr.setSelection(TextSelection.create(newTr.doc, from, to + diff))
          view.dispatch(newTr)
          return true
        }

        view.dispatch(tr.insertText(indentString, from))
        return true
      },

      // Handle Shift-Tab key for unindentation
      'Shift-Tab': ({ editor }) => {
        const { state, view } = editor
        const { selection, tr } = state
        const { $from, $to, from, to } = selection

        if ($from.parent.type.name !== this.name) {
          return false
        }

        const indentRegex = /^ {1,4}/
        const codeBlockStart = $from.before() + 1
        const codeBlockEnd = $to.after() - 1
        const fullText = state.doc.textBetween(
          codeBlockStart,
          codeBlockEnd,
          '\n'
        )

        if (from !== to) {
          const lines = fullText.split('\n')
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
          const newTr = tr.replaceWith(
            codeBlockStart,
            codeBlockEnd,
            state.schema.text(newText)
          )
          newTr.setSelection(
            TextSelection.create(newTr.doc, from, to - totalRemoved)
          )

          view.dispatch(newTr)
          return true
        }

        const relativePos = from - codeBlockStart
        const textBeforeCursor = fullText.slice(0, relativePos)
        const currentLineStartIdx = textBeforeCursor.lastIndexOf('\n') + 1
        const nextLineBreakIdx = fullText.indexOf('\n', relativePos)
        const currentLineEndIdx =
          nextLineBreakIdx === -1 ? fullText.length : nextLineBreakIdx

        const currentLineText = fullText.slice(
          currentLineStartIdx,
          currentLineEndIdx
        )
        const match = currentLineText.match(indentRegex)

        if (match) {
          const lengthToRemove = match[0].length
          const absoluteLineStart = codeBlockStart + currentLineStartIdx
          view.dispatch(
            tr.delete(absoluteLineStart, absoluteLineStart + lengthToRemove)
          )
          return true
        }

        return true
      },

      // Handle Enter key for auto-indentation
      Enter: ({ editor }) => {
        const { state, view } = editor
        const { selection, tr } = state
        const { $from, from } = selection

        if ($from.parent.type.name !== this.name) {
          return false
        }

        const codeBlockStart = $from.before() + 1
        const fullText = state.doc.textBetween(
          codeBlockStart,
          $from.after() - 1,
          '\n'
        )

        // Find the start of the current line before the cursor
        const relativePos = from - codeBlockStart
        const textBeforeCursor = fullText.slice(0, relativePos)
        const currentLineStartIdx = textBeforeCursor.lastIndexOf('\n') + 1

        // Extract the current line text up to the cursor
        const currentLineText = textBeforeCursor.slice(currentLineStartIdx)

        // Match leading spaces or tabs of the current line
        const spaceMatch = currentLineText.match(/^[\s\t]*/)
        const leadingSpaces = spaceMatch ? spaceMatch[0] : ''

        // Insert newline character followed by the same leading spaces
        const textToInsert = '\n' + leadingSpaces
        view.dispatch(tr.insertText(textToInsert, from))

        return true
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
}).configure({
  languageClassPrefix: 'language-',
  defaultLanguage: 'bash',
  diagramTheme: 'neutral',
  lowlight,
})

export default OCodeBlock

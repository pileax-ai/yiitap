import { Blockquote as TiptapBlockquote } from '@tiptap/extension-blockquote'
import type { BlockquoteOptions as TiptapBlockquoteOptions } from '@tiptap/extension-blockquote'
import { wrappingInputRule } from '@tiptap/core'

export interface BlockquoteOptions extends TiptapBlockquoteOptions {
  triggerCharacters: string[]
}

export const Blockquote = TiptapBlockquote.extend<BlockquoteOptions>({
  draggable: true,

  addOptions() {
    return {
      ...(this.parent?.() as TiptapBlockquoteOptions),
      /**
       * triggerCharacters
       * default: ['>']
       * custom: ['"', '“', '”']
       */
      triggerCharacters: ['>'],
    } as BlockquoteOptions
  },

  addInputRules() {
    const { triggerCharacters } = this.options
    const escaped = triggerCharacters
      .map((ch) => ch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('')
    const inputRegex = new RegExp(`^[${escaped}]\\s$`)

    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },
})

export default Blockquote

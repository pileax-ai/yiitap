import type { NodeSpec, DOMOutputSpec } from '@tiptap/pm/model'

export type ColumnNodes = Record<'column' | 'columns', NodeSpec>

export function columnNodes(): ColumnNodes {
  return {
    column: {
      group: 'block',
      content: 'block+',
      defining: true,
      isolating: true,
      selectable: true,
      attrs: {
        // English: Use flexGrow to match your Tiptap addAttributes logic
        flexGrow: { default: 1 },
      },
      parseDOM: [
        {
          tag: 'div.prosemirror-column',
          getAttrs(dom) {
            if (!(dom instanceof HTMLElement)) return false
            // English: Extract flex-grow from inline style
            return {
              flexGrow: parseFloat(dom.style.flexGrow) || 1,
            }
          },
        },
      ],
      toDOM(node): DOMOutputSpec {
        const { flexGrow } = node.attrs
        return [
          'div',
          {
            class: 'prosemirror-column',
            // English: Critical: Ensure style is a valid string for serialization
            style: `flex-grow: ${flexGrow || 1};`,
          },
          0,
        ]
      },
    },
    columns: {
      group: 'block',
      // English: Using '*' is key to fixing "Failed to serialize" during slice operations
      content: 'column*',
      isolating: true,
      selectable: true,
      parseDOM: [
        {
          tag: 'div.prosemirror-column-container',
        },
      ],
      toDOM(): DOMOutputSpec {
        return [
          'div',
          {
            class: 'prosemirror-column-container',
            // English: Explicit display:flex helps layout when pasted into other apps
            style: 'display: flex;',
          },
          0,
        ]
      },
    },
  }
}

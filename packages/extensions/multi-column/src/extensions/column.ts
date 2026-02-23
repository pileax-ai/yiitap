import { Node, mergeAttributes } from '@tiptap/core'

export interface ColumnOptions {
  HTMLAttributes: Record<string, any>
}

export const Column = Node.create<ColumnOptions>({
  name: 'column',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  selectable: true,

  addAttributes() {
    return {
      flexGrow: {
        default: 1,
        parseHTML: (element) => parseFloat(element.style.flexGrow) || 1,
        renderHTML: (attributes) => {
          if (!attributes.flexGrow) {
            return {}
          }
          return {
            style: `flex-grow: ${attributes.flexGrow};`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
      }),
      0,
    ]
  },

  // todo: not work
  renderMarkdown: (node, h) => {
    if (node.content) {
      const lines = h.renderChildren(node.content, '\n')
      return lines + '\n\n'
    } else {
      return ''
    }
  },
})

import { Node, mergeAttributes } from '@tiptap/core'

export interface ColumnContainerOptions {
  HTMLAttributes: Record<string, any>
}

export const ColumnContainer = Node.create<ColumnContainerOptions>({
  name: 'columns',
  group: 'block',
  content: 'column*',
  isolating: true,
  selectable: true,
  inline: false,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column-container"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column-container',
      }),
      0,
    ]
  },

  renderMarkdown: (node, h) => {
    if (node.content) {
      const lines: string[] = []
      node.content.forEach((child) => {
        if (child.content) {
          const childLines = h.renderChildren(child.content, '\n')
          lines.push(childLines)
        }
      })
      return lines.join('\n\n') + '\n\n'
    } else {
      return ''
    }
  },
})

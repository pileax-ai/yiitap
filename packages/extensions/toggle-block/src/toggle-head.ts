// toggleHead.ts
import { Node, InputRule, mergeAttributes } from '@tiptap/core'

export interface ToggleHeadOptions {
  levels: number[]
}

export const ToggleHead = Node.create<ToggleHeadOptions>({
  name: 'toggleHead',
  content: 'inline*',
  defining: true,
  isolating: true,
  priority: 1000,

  addOptions() {
    return {
      levels: [0, 1, 2, 3, 4, 5],
    }
  },

  addAttributes() {
    return {
      level: {
        default: 0,
        parseHTML: element => {
          const tag = element.tagName.toLowerCase()
          if (tag === 'div') return 0
          if (tag === 'h1') return 1
          if (tag === 'h2') return 2
          if (tag === 'h3') return 3
          if (tag === 'h4') return 4
          if (tag === 'h5') return 5
          return parseInt(element.getAttribute('data-level') || '0', 10)
        },
        renderHTML: attributes => {
          if (!this.options.levels.includes(attributes.level)) {
            return {}
          }
          return {
            'data-level': attributes.level,
          }
        },
      },
    }
  },

  parseHTML() {
    return this.options.levels.map((level: number) => {
      const tag = level === 0 ? 'div' : `h${level}`
      return {
        tag: `${tag}[data-type="toggle-head"]`,
        attrs: { level },
      }
    })
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel ? node.attrs.level : this.options.levels[0]
    const tagName = level === 0 ? 'div' : `h${level}`

    return [
      tagName,
      mergeAttributes(HTMLAttributes, {
        'data-type': 'toggle-head',
        class: `toggle-head toggle-head-h${level}`,
      }),
      0,
    ]
  },

  addInputRules() {
    return [
      new InputRule({
        // Match syntax starting with #, ##, ### followed by a space
        find: /^(#{1,5})\s$/,
        handler: ({ state, range, match }) => {
          const level = match[1].length // Get the count of # as level (1, 2, 3...)
          const { $from } = state.selection

          // 1. Ensure current cursor is actually inside toggleHead
          if ($from.parent.type.name !== 'toggleHead') {
            return
          }

          const { tr, schema } = state

          // 2. Delete the entered markdown symbol (e.g. "# ")
          tr.delete(range.from, range.to)

          // 3. Get start position and current attributes of the toggleHead node
          const headPos = $from.before($from.depth)
          const headNode = state.doc.nodeAt(headPos)

          if (headNode) {
            // 4. Update the level attribute of toggleHead using setNodeMarkup
            tr.setNodeMarkup(headPos, undefined, {
              ...headNode.attrs,
              level: level,
            })
          }
        },
      }),
    ]
  },
})

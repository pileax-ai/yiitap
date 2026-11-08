// toggleHead.ts
import { Node, InputRule, mergeAttributes } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { shouldSiblingStop } from './util'

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
        parseHTML: (element) => {
          const tag = element.tagName.toLowerCase()
          if (tag === 'div') return 0
          if (tag === 'h1') return 1
          if (tag === 'h2') return 2
          if (tag === 'h3') return 3
          if (tag === 'h4') return 4
          if (tag === 'h5') return 5
          return parseInt(element.getAttribute('data-level') || '0', 10)
        },
        renderHTML: (attributes) => {
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
        // Match markdown heading syntax: #, ##, ### ... followed by a space
        find: /^(#{1,5})\s$/,
        handler: ({ state, range, match }) => {
          const level = match[1].length
          const { $from } = state.selection

          // 1. Ensure the cursor is inside a toggleHead
          if ($from.parent.type.name !== 'toggleHead') return

          const { tr, schema } = state
          const headDepth = $from.depth
          const toggleDepth = headDepth - 1
          const toggleNode = $from.node(toggleDepth)
          if (!toggleNode) return

          // Use the node's own type name — safer than `this.name`, which may be
          // undefined depending on how the InputRule was created/bound.
          const toggleName = toggleNode.type.name

          // 2. Collect siblings that should be absorbed into toggleBody.
          //    Done BEFORE any mutation so positions are stable.
          //    A SMALLER level number = HIGHER hierarchy = absorbs MORE siblings.
          //    Level 0 (toggle list) absorbs every heading (heading levels start at 1).
          const parentContainer = $from.node(toggleDepth - 1)
          const nodeIndex = $from.index(toggleDepth - 1)
          const absorbed: any[] = []
          let extraSize = 0
          for (let i = nodeIndex + 1; i < parentContainer.childCount; i++) {
            const sib = parentContainer.child(i)
            if (shouldSiblingStop(sib, level)) break
            absorbed.push(sib)
            extraSize += sib.nodeSize
          }

          // 3. Fast path: nothing to absorb → original behavior (verified working).
          if (absorbed.length === 0) {
            tr.delete(range.from, range.to)
            const headPos = $from.before($from.depth)
            const headNode = state.doc.nodeAt(headPos)
            if (headNode) {
              tr.setNodeMarkup(headPos, undefined, { ...headNode.attrs, level })
            }
            return
          }

          // 4. Slow path: rebuild the whole toggleBlock and absorb siblings.
          const headNode = toggleNode.child(0)
          const bodyNode = toggleNode.child(1)

          // Strip the typed prefix [range.from, range.to) from head content.
          const newHeadContent: any[] = []
          let pos = $from.start(headDepth)
          headNode.forEach((node: any) => {
            const s = pos
            const e = pos + node.nodeSize
            pos = e
            if (e <= range.from || s >= range.to) {
              // Entirely outside the prefix → keep as-is.
              newHeadContent.push(node)
            } else if (node.isText) {
              // Partially overlapping text → keep only non-overlapping slices.
              const text = node.text || ''
              const lf = Math.max(0, range.from - s)
              const lt = Math.min(text.length, range.to - s)
              const before = text.slice(0, lf)
              const after = text.slice(lt)
              if (before) newHeadContent.push(schema.text(before, node.marks))
              if (after) newHeadContent.push(schema.text(after, node.marks))
            }
          })

          // Merge existing body content with the absorbed siblings.
          const newBodyContent: any[] = []
          bodyNode.forEach((c: any) => newBodyContent.push(c))

          // Drop the placeholder empty paragraph if real content will be absorbed.
          if (
            newBodyContent.length === 1 &&
            newBodyContent[0].type.name === 'paragraph' &&
            newBodyContent[0].content.size === 0
          ) {
            newBodyContent.length = 0
          }
          newBodyContent.push(...absorbed)

          // toggleBody must never be empty (schema requires block+).
          if (newBodyContent.length === 0) {
            newBodyContent.push(schema.node('paragraph', {}, []))
          }

          const blockStart = $from.before(toggleDepth)
          const blockEnd = $from.after(toggleDepth)
          const newHead = schema.node(
            'toggleHead',
            { ...headNode.attrs, level },
            newHeadContent
          )
          const newBody = schema.node('toggleBody', {}, newBodyContent)
          const newToggle = schema.node(toggleName, toggleNode.attrs, [
            newHead,
            newBody,
          ])

          tr.replaceWith(blockStart, blockEnd + extraSize, newToggle)
          tr.setSelection(TextSelection.near(tr.doc.resolve(blockStart + 1)))
        },
      }),
    ]
  },
})

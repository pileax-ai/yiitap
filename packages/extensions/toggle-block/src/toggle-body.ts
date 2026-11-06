// toggleBody.ts
import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface ToggleBodyOptions {
  placeholder: string | (() => string)
}

export const ToggleBody = Node.create<ToggleBodyOptions>({
  name: 'toggleBody',
  content: 'block+',
  defining: true,
  isolating: true,

  addOptions() {
    return {
      placeholder: 'Empty toggle',
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggle-body"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const placeholder = typeof this.options.placeholder === 'function'
      ? this.options.placeholder()
      : this.options.placeholder

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'toggle-body',
        class: 'toggle-body',
        'data-placeholder': placeholder,
      }),
      0,
    ]
  },

  addProseMirrorPlugins() {
    const name = this.name
    return [
      new Plugin({
        key: new PluginKey('toggleBodyPlaceholder'),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = []
            const { doc, selection } = state
            const { $from } = selection

            doc.descendants((node, pos) => {
              if (node.type.name === name) {
                // Check if the current toggleBody is empty
                const isEmpty =
                  node.content.size === 0 ||
                  (node.childCount === 1 && node.firstChild?.content.size === 0)

                // Check whether the current cursor is inside this toggleBody
                const isFocused =
                  $from.pos >= pos && $from.pos <= pos + node.nodeSize

                const classNames = ['toggle-body']
                if (isEmpty) classNames.push('is-empty')

                // Use NodeDecoration to dynamically inject class names into the DOM node
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: classNames.join(' '),
                  })
                )
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

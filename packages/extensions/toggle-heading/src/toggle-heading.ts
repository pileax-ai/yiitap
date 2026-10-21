import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

import { buildDecorations  } from './util'

export const toggleHeadingKey = new PluginKey<Set<string>>('toggleHeading')

export interface ToggleHeadingOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleHeading: {
      toggleHeading: (slug: string) => ReturnType
    }
  }
}

export const ToggleHeading = Extension.create<ToggleHeadingOptions>({
  name: 'toggleHeading',

  addProseMirrorPlugins() {
    return [
      new Plugin<Set<string>>({
        key: toggleHeadingKey,
        state: {
          init: () => new Set<string>(),
          apply(tr, folded) {
            const meta = tr.getMeta(toggleHeadingKey) as { toggle?: string } | undefined
            if (meta?.toggle) {
              const next = new Set(folded)
              if (next.has(meta.toggle)) {
                next.delete(meta.toggle)
              } else {
                next.add(meta.toggle)
              }
              return next
            }
            return folded
          },
        },
        props: {
          decorations(state) {
            const folded = toggleHeadingKey.getState(state) || new Set()
            return buildDecorations(state.doc, folded)
          },
          handleDOMEvents: {
            click(view: EditorView, event: MouseEvent) {
              const target = event.target as HTMLElement | null
              if (!target) return false

              // 1. 判断点击是否落在折叠按钮上（closest 兼容按钮内部有子元素）
              const btn = target.closest<HTMLButtonElement>('.cw-fold-btn')
              if (!btn) return false

              // 2. 阻止默认行为与冒泡，避免触发光标移动 / 选中
              event.preventDefault()
              event.stopPropagation()

              // 3. 从 dataset 读取 slug（widget 里已挂 btn.dataset.slug = h.slug）
              const slug = btn.dataset.slug
              if (!slug) return false

              // 4. 派发带 meta 的事务切换折叠状态
              const { tr } = view.state
              tr.setMeta(toggleHeadingKey, { toggle: slug })
              view.dispatch(tr)

              // 5. 返回 true 表示事件已处理，ProseMirror 不再继续处理
              return true
            },
          }
        },
      }),
    ]
  },

  addCommands() {
    return {
      toggleHeading:
        (slug: string) =>
          ({ tr, dispatch }) => {
            if (dispatch) {
              tr.setMeta(toggleHeadingKey, { toggle: slug })
            }
            return true
          },
    }
  },
})

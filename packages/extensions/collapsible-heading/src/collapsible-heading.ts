import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { buildDecorations } from './util'

export interface CollapsibleHeadingPluginState {
  collapsed: Set<string>
  decorations: any
  enabled: boolean
}

export const collapsibleHeadingKey = new PluginKey<CollapsibleHeadingPluginState>('collapsibleHeading')

export interface CollapsibleHeadingOptions {
  enabled: boolean | (() => boolean)
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    collapsibleHeading: {
      collapsibleHeading: (slug: string) => ReturnType
    }
  }
}

export const CollapsibleHeading = Extension.create<CollapsibleHeadingOptions>({
  name: 'collapsibleHeading',

  addOptions() {
    return {
      enabled: true,
      HTMLAttributes: {},
    }
  },

  addProseMirrorPlugins() {
    const isEnabled = () => {
      const enabled = this.options.enabled
      return typeof enabled === 'function' ? enabled() : enabled
    }

    return [
      new Plugin<CollapsibleHeadingPluginState>({
        key: collapsibleHeadingKey,
        state: {
          init: (_, state) => ({
            collapsed: new Set<string>(),
            decorations: buildDecorations(state.doc, new Set<string>(), isEnabled()),
            enabled: isEnabled(),
          }),
          apply(tr, pluginState, _oldState, newState) {
            const currentEnabled = isEnabled()
            const meta = tr.getMeta(collapsibleHeadingKey) as { toggle?: string } | undefined
            const docChanged = tr.docChanged
            const foldToggled = Boolean(meta?.toggle)
            const enabledChanged = currentEnabled !== pluginState.enabled  // ← 新增

            if (!docChanged && !foldToggled && !enabledChanged) {
              return pluginState
            }

            let nextCollapsed = pluginState.collapsed
            if (foldToggled && meta?.toggle) {
              nextCollapsed = new Set(pluginState.collapsed)
              if (nextCollapsed.has(meta.toggle)) {
                nextCollapsed.delete(meta.toggle)
              } else {
                nextCollapsed.add(meta.toggle)
              }
            }

            return {
              collapsed: nextCollapsed,
              decorations: buildDecorations(newState.doc, nextCollapsed, currentEnabled),
              enabled: currentEnabled,
            }
          },
        },
        props: {
          decorations(state) {
            return collapsibleHeadingKey.getState(state)?.decorations ?? null
          },
          handleDOMEvents: {
            click(view: EditorView, event: MouseEvent) {
              if (!isEnabled()) return false

              const target = event.target as HTMLElement | null
              if (!target) return false

              const btn = target.closest<HTMLButtonElement>('.cw-fold-btn')
              if (!btn) return false

              event.preventDefault()
              event.stopPropagation()

              const slug = btn.dataset.slug
              if (!slug) return false

              const { tr } = view.state
              tr.setMeta(collapsibleHeadingKey, { toggle: slug })
              view.dispatch(tr)

              return true
            },
          },
        },
      }),
    ]
  },

  addCommands() {
    const isEnabled = () => {
      const enabled = this.options.enabled
      return typeof enabled === 'function' ? enabled() : enabled
    }

    return {
      collapsibleHeading: (slug: string) => {
        return ({ tr, dispatch }) => {
          if (!isEnabled()) return false
          if (dispatch) {
            tr.setMeta(collapsibleHeadingKey, { toggle: slug })
            dispatch(tr)
          }
          return true
        }
      },
    }
  },
})

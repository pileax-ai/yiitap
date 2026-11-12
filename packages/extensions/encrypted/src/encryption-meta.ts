import { Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { encodeBase64 } from '@yiitap/core'

import { ENCRYPTION_META_NODE, EncryptionMetaOptions, findMetaNode, parseEncryptionMeta } from './util'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    encryptionMeta: {
      setEncryptionMeta: (meta: EncryptionMetaOptions) => ReturnType
    }
  }
}

export const EncryptionMeta = Node.create<EncryptionMetaOptions>({
  name: ENCRYPTION_META_NODE,
  group: 'block',
  atom: true,
  selectable: false,
  draggable: false,
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      version: { default: null },
      tips: { default: null },
      salt: { default: null },
      ciphertext: { default: null },
      iv: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="encryption-meta"]',
        getAttrs: (element) => {
          const raw = (element as HTMLElement).getAttribute('data-encryption-meta')

          return parseEncryptionMeta(raw)
        },
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-type': 'encryption-meta',
        'data-encryption-meta': encodeBase64(JSON.stringify(node.attrs)),
        style: 'display:none',
      },
    ]
  },

  // Protection plugin: position lock + deletion guard ----
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('encryptionMetaProtection'),

        filterTransaction(tr, state) {
          if (tr.getMeta('encryptionMetaProtect')) return true
          if (tr.getMeta('encryptionMetaAllowRemoval')) return true
          if (!tr.docChanged) return true

          const oldMeta = findMetaNode(state.doc)
          if (!oldMeta) return true

          // Structural check without instanceof to avoid duplicate-package issues.
          // Any step spanning from 0 to the end of the old doc means a full replacement.
          const isFullDocReplace = tr.steps.some(step => {
            const s = step as any
            return s.from === 0 && s.to === tr.before.content.size
          })

          if (isFullDocReplace) return true

          const newMeta = findMetaNode(tr.doc)
          if (!newMeta) return false
          return true
        },

        appendTransaction(trs, oldState, newState) {
          if (!trs.some(tr => tr.docChanged)) return null

          const oldMeta = findMetaNode(oldState.doc)
          if (!oldMeta) return null

          const newMeta = findMetaNode(newState.doc)
          if (!newMeta) return null

          // Remove any extra meta nodes; only the first one is kept
          const extraPositions: number[] = []
          let seen = 0
          newState.doc.descendants((node, pos) => {
            if (node.type.name === ENCRYPTION_META_NODE) {
              seen++
              if (seen > 1) extraPositions.push(pos)
            }
          })

          if (newMeta.pos !== 0 || extraPositions.length > 0) {
            const tr = newState.tr
            // Delete extras from the end to keep positions valid
            for (let i = extraPositions.length - 1; i >= 0; i--) {
              const pos = extraPositions[i]
              const node = newState.doc.nodeAt(pos)
              if (node) tr.delete(pos, pos + node.nodeSize)
            }
            // Move the first meta node to position 0 if needed
            if (newMeta.pos !== 0) {
              tr.delete(newMeta.pos, newMeta.pos + newMeta.node.nodeSize)
              tr.insert(0, newMeta.node)
            }
            tr.setMeta('encryptionMetaProtect', true)
            return tr
          }
          return null
        },
      }),
    ]
  },

  addCommands() {
    return {
      setEncryptionMeta:
        (meta: EncryptionMetaOptions) =>
          ({ state, dispatch }) => {
            const first = state.doc.firstChild
            const nodeType = state.schema.nodes[ENCRYPTION_META_NODE]
            if (!nodeType) return false

            if (!first || first.type.name !== ENCRYPTION_META_NODE) {
              // Create and insert the meta node at position 0
              if (dispatch) {
                dispatch(state.tr.insert(0, nodeType.create(meta)))
              }
              return true
            }

            // Merge into existing attributes
            if (dispatch) {
              dispatch(state.tr.setNodeMarkup(0, undefined, { ...first.attrs, ...meta }))
            }
            return true
          },
    }
  },
})


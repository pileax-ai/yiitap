import { Node, nodeInputRule, mergeAttributes } from '@tiptap/core'
import { encodeBase64 } from '@yiitap/core'

import { parseEncryptedBlock } from './util'

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export interface EncryptedBlockOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    encryptedBlock: {
      setEncryptedBlock: (options: any) => ReturnType
    }
  }
}

export const EncryptedBlock = Node.create<EncryptedBlockOptions>({
  name: 'encryptedBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      ciphertext: {
        default: '',
      },
      iv: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'encrypted-block',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          const raw = el.getAttribute('data-encryption-meta')
          return parseEncryptedBlock(raw)
        },
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'encrypted-block',
      {
        'data-encryption-meta': encodeBase64(
          JSON.stringify({
            ciphertext: node.attrs.ciphertext,
            iv: node.attrs.iv,
          })
        ),
      },
    ]
  },

  /**
   * Use the same token name for parsing/rendering
   */
  markdownTokenName: 'encryptedBlock',

  parseMarkdown: (token, helpers) => {
    // Directly create the node using attributes extracted by tokenizer
    return helpers.createNode('encryptedBlock', {
      src: token.src,
      caption: token.caption,
    })
  },

  renderMarkdown: (node) => {
    const src = node.attrs?.src ?? ''
    const caption = node.attrs?.caption ?? ''
    return `<encrypted-block src="${src}" caption="${caption}"></encrypted-block>`
  },

  markdownTokenizer: {
    name: 'encryptedBlock',
    level: 'block', // Force it to be treated as a block node to avoid RangeError
    // Locate the start of the tag
    start: (src: string) => src.match(/<encrypted-block/)?.index ?? -1,
    tokenize(src: string) {
      // Regex to capture the entire tag and its attributes
      const match =
        /^<encrypted-block\b([^>]*)><\/encrypted-block>\s*(?:\n|$)/i.exec(src)
      if (!match) return undefined

      const attrsStr = match[1]
      const srcMatch = attrsStr.match(/src="([^"]*)"/i)
      const captionMatch = attrsStr.match(/caption="([^"]*)"/i)

      return {
        type: 'encryptedBlock',
        raw: match[0],
        src: srcMatch ? srcMatch[1] : '',
        caption: captionMatch ? captionMatch[1] : '',
      }
    },
  },

  addCommands() {
    return {
      setEncryptedBlock:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [src] = match

          return { src }
        },
      }),
    ]
  },
})

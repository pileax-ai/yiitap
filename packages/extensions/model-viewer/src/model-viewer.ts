import { Node, nodeInputRule, mergeAttributes } from '@tiptap/core'

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    modelViewer: {
      setModelViewer: (options: any) => ReturnType
    }
  }
}

export const ModelViewer = Node.create({
  name: 'modelViewer',
  group: 'block',
  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      caption: {
        default: '',
        parseHTML: (element) => element.getAttribute('caption'),
      },
      src: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute('src') || ''
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'model-viewer',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'model-viewer',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ]
  },

  /**
   * Use the same token name for parsing/rendering
   */
  markdownTokenName: 'modelViewer',

  parseMarkdown: (token, helpers) => {
    // Directly create the node using attributes extracted by tokenizer
    return helpers.createNode('modelViewer', {
      src: token.src,
      caption: token.caption,
    })
  },

  renderMarkdown: (node) => {
    const src = node.attrs?.src ?? ''
    const caption = node.attrs?.caption ?? ''
    return `<model-viewer src="${src}" caption="${caption}"></model-viewer>`
  },

  markdownTokenizer: {
    name: 'modelViewer',
    level: 'block', // Force it to be treated as a block node to avoid RangeError
    // Locate the start of the tag
    start: (src: string) => src.match(/<model-viewer/)?.index ?? -1,
    tokenize(src: string) {
      // Regex to capture the entire tag and its attributes
      const match = /^<model-viewer\b([^>]*)><\/model-viewer>\s*(?:\n|$)/i.exec(
        src
      )
      if (!match) return undefined

      const attrsStr = match[1]
      const srcMatch = attrsStr.match(/src="([^"]*)"/i)
      const captionMatch = attrsStr.match(/caption="([^"]*)"/i)

      return {
        type: 'modelViewer',
        raw: match[0],
        src: srcMatch ? srcMatch[1] : '',
        caption: captionMatch ? captionMatch[1] : '',
      }
    },
  },

  addCommands() {
    return {
      setModelViewer:
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

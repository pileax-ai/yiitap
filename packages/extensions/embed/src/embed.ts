import { Node, mergeAttributes, type CommandProps } from '@tiptap/core'

import { Plugin, PluginKey } from '@tiptap/pm/state'
import { reduceType, reduceTypeByFile, generateId } from './util'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (options: any) => ReturnType
      setEmbedMedia: (url: string, type: string, id: string) => ReturnType
      uploadFile: (file: File, id: string) => ReturnType
    }
    image: {
      setImage: (options: any) => ReturnType
    }
  }
}

export const MediaTypes = ['audio', 'image', 'modelViewer', 'video']

export const Embed = Node.create({
  name: 'embed',
  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  addAttributes() {
    return {
      caption: {
        default: '',
        rendered: true,
      },
      type: {
        default: '',
        rendered: true,
      },
      src: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute('src') || ''
        },
      },
      uploading: {
        default: false,
        rendered: false,
      },
      width: {
        default: 0,
        rendered: true,
      },
      height: {
        default: 0,
        rendered: true,
      },
      containerHeight: {
        default: 0,
        rendered: true,
      },
      positionY: {
        default: 0,
        rendered: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'embed',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.containerHeight = node.attrs.containerHeight
    HTMLAttributes.positionY = node.attrs.positionY

    return [
      'embed',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ]
  },

  /**
   * Use the same token name for parsing/rendering
   */
  markdownTokenName: 'embed',

  parseMarkdown: (token, helpers) => {
    // Directly create the node using attributes extracted by tokenizer
    return helpers.createNode('embed', {
      src: token.src,
      caption: token.caption,
    })
  },

  renderMarkdown: (node) => {
    const src = node.attrs?.src ?? ''
    const caption = node.attrs?.caption ?? ''
    return `<embed src="${src}" caption="${caption}"></embed>`
  },

  markdownTokenizer: {
    name: 'embed',
    level: 'block', // Force it to be treated as a block node to avoid RangeError
    // Locate the start of the tag
    start: (src: string) => src.match(/<embed/)?.index ?? -1,
    tokenize(src: string) {
      // Regex to capture the entire tag and its attributes
      const match = /^<embed\b([^>]*)><\/embed>\s*(?:\n|$)/i.exec(src)
      if (!match) return undefined

      const attrsStr = match[1]
      const srcMatch = attrsStr.match(/src="([^"]*)"/i)
      const captionMatch = attrsStr.match(/caption="([^"]*)"/i)

      return {
        type: 'embed',
        raw: match[0],
        src: srcMatch ? srcMatch[1] : '',
        caption: captionMatch ? captionMatch[1] : '',
      }
    },
  },

  addCommands() {
    return {
      setEmbed:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options })
        },
      setEmbedMedia:
        (url: string, type: string, id: string) =>
        ({ editor }: CommandProps) => {
          if (editor.isDestroyed) return false
          let currentPos = -1
          editor.state.doc.descendants((node, p) => {
            if (node.type.name === 'embed' && node.attrs.id === id) {
              currentPos = p
              return false
            }
          })

          if (currentPos === -1) {
            return false
          }

          // media: image, video, model
          if (MediaTypes.includes(type)) {
            editor
              .chain()
              .insertContentAt(
                { from: currentPos, to: currentPos + 1 },
                { type: type, attrs: { src: url } }
              )
              .run()
          }
          return true
        },
      uploadFile:
        (file: File, id: string) =>
        ({ editor }: CommandProps) => {
          const onUpload = (editor.storage as any).uploadManager?.onUpload
          if (!onUpload) {
            console.warn(
              'onUpload callback is not defined in UploadManager extension options.'
            )
            return false
          }

          const type = reduceTypeByFile(file)
          onUpload(file, type)
            .then((url: string) => {
              if (editor.isDestroyed) return false
              let currentPos = -1
              editor.state.doc.descendants((node, p) => {
                if (node.type.name === 'embed' && node.attrs.id === id) {
                  currentPos = p
                  return false
                }
              })

              if (currentPos === -1) {
                return false
              }

              // media: image, video, model
              if (MediaTypes.includes(type)) {
                editor
                  .chain()
                  .insertContentAt(
                    { from: currentPos, to: currentPos + 1 },
                    { type: type, attrs: { src: url } }
                  )
                  .run()
              } else {
                editor
                  .chain()
                  .setNodeSelection(currentPos)
                  .updateAttributes('embed', {
                    src: url,
                    caption: file.name,
                    type: file.type,
                    uploading: false,
                  })
                  .setMeta('addToHistory', false)
                  .run()
              }
            })
            .catch((err: Error) => {
              console.error('Upload failed:', err)
            })

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('handlePasteAndDrop'),
        props: {
          handlePaste: (view, event, slice) => {
            const { items } = event.clipboardData || {}
            if (!items || items.length === 0) return false
            const item = items[0]

            if (item.kind === 'file') {
              const file = item.getAsFile()
              if (file) {
                // embed placeholder
                const id = generateId()
                const { from } = view.state.selection
                const node = view.state.schema.node('embed', {
                  id: id,
                  src: 'init',
                  uploading: true,
                })
                const tr = view.state.tr.insert(from, node)
                view.dispatch(tr)

                // upload file
                this.editor.commands.uploadFile(file, id)
                return true
              }
            }

            return false
          },
          handleDrop: (view, event, slice, moved) => {
            // Editor inner
            if (moved) return false

            const { files } = event.dataTransfer || {}
            if (!files || files.length === 0) return false

            const file = files[0]

            // Position
            const coordinates = { left: event.clientX, top: event.clientY }
            const result = view.posAtCoords(coordinates)
            const insertPos = result ? result.pos : view.state.doc.content.size

            if (file) {
              const id = generateId()
              const node = view.state.schema.node('embed', {
                id,
                src: 'init',
                uploading: true,
              })
              const tr = view.state.tr.insert(insertPos, node)
              view.dispatch(tr)

              this.editor.commands.uploadFile(file, id)

              event.preventDefault()
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})

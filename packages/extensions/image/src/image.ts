import { mergeAttributes, type CommandProps } from '@tiptap/core'

import { default as TiptapImage } from '@tiptap/extension-image'
import type { ImageOptions as TiptapImageOptions } from '@tiptap/extension-image'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploadImage: (file: File) => ReturnType
  }
}

export interface ImageOptions extends TiptapImageOptions {
  onUpload?: (file: File, type: string) => Promise<string>
}

export const Image = TiptapImage.extend<ImageOptions>({
  draggable: true,

  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      onUpload: undefined,
    } as ImageOptions
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      containerHeight: {
        default: 0,
        rendered: true,
      },
      positionY: {
        default: 0,
        rendered: true,
      },
      isDraggable: {
        default: true,
        renderHTML: (attributes) => {
          return {}
        },
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.containerHeight = node.attrs.containerHeight
    HTMLAttributes.positionY = node.attrs.positionY

    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      uploadImage:
        (file: File) =>
        ({ editor }: CommandProps) => {
          const onUpload = (editor.storage as any).uploadManager?.onUpload
          if (!onUpload) {
            console.warn(
              'onUpload callback is not defined in UploadManager extension options.'
            )
            return false
          }

          onUpload(file, 'image')
            .then((url: string) => {
              editor.commands.setImage({ src: url })
            })
            .catch((err: Error) => {
              console.error('Upload failed:', err)
            })

          return true
        },
    }
  },
})

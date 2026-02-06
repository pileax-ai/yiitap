import { mergeAttributes } from '@tiptap/core'
import { default as TiptapImage } from '@tiptap/extension-image'
import type { ImageOptions } from '@tiptap/extension-image'

export const Image = TiptapImage.extend<ImageOptions>({
  draggable: true,
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
})

export { ImageOptions }

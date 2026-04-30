import tippy, { type Instance, type Props } from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import View from './view.vue'
import { Blocks } from '../../../constants/block'
import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from '@tiptap/suggestion'
import { type MentionNodeAttrs } from '@tiptap/extension-mention'

interface SlashSuggestionOptions {
  // Array of block values to hide
  exclude?: string[]
  // Custom filter logic if needed
  customFilter?: (item: any) => boolean
}

export const createSlashSuggestion = (options: SlashSuggestionOptions = {}) => {
  const { exclude = [], customFilter } = options

  return {
    items: ({ query }: { query: string }) => {
      return Blocks.filter((item) => {
        // 1. Filter out excluded items
        if (exclude.includes(item.value)) return false

        // 2. Apply custom filter if provided
        if (customFilter && !customFilter(item)) return false

        // 3. Apply search logic
        const searchTerm = query.toLowerCase()
        return (
          item.value.toLowerCase().includes(searchTerm) ||
          item.keywords?.toLowerCase().includes(searchTerm)
        )
      })
    },
    render: () => {
      let component: VueRenderer
      let popup: Instance<Props>[]

      return {
        onStart: (props: SuggestionProps<any, MentionNodeAttrs>) => {
          component = new VueRenderer(View, {
            props,
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            arrow: false,
            onShow: (instance) => {
              instance.popper.classList.add('slash-tippy')
            },
          })
        },

        onUpdate(props: SuggestionProps) {
          component.updateProps(props)

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },

        onKeyDown(props: SuggestionKeyDownProps) {
          // console.log('down', props.event)
          if (props.event.key === 'Escape') {
            popup[0].hide()
            component.destroy()

            return true
          }

          return component.ref?.onKeyDown(props)
        },

        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  }
}

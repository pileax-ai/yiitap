<template>
  <main
    class="yiitap yiitap-code-editor"
    :data-theme="darkModeAlt ? 'dark' : ''"
  >
    <!-- Editor Content -->
    <editor-content
      class="editor-content"
      :class="`${pageView}-view`"
      :editor="editor"
    />
  </main>
</template>

<script setup lang="ts">
/**
 * YiiCodeEditor is a simple code editor for Vue.
 */

defineOptions({ name: 'YiiEditor' })

import {
  ref,
  computed,
  onBeforeMount,
  provide,
  watch,
  type PropType,
} from 'vue'
import {
  Editor,
  type EditorEvents,
  type FocusPosition,
  type JSONContent,
} from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'

import useI18n from '../hooks/useI18n'
import { OCodeBlock, OShortcut, Markdown } from '../extensions'

const props = defineProps({
  /**
   * Initial content. This can be HTML or JSON.
   */
  content: {
    type: [String, Object],
    default: '',
  },
  /**
   * Determines if users can write into the editor.
   */
  editable: {
    type: Boolean,
    default: true,
  },
  /**
   * Force the cursor to jump in the editor on initialization.
   */
  autofocus: {
    type: [String, Number, Boolean] as PropType<FocusPosition>,
    default: false,
  },
  /**
   * Set the locale of the editor
   */
  locale: {
    type: String,
    default: 'en',
  },
  /**
   * By default, Yiitap is in light mode, you can set it to dark mode.
   */
  darkMode: {
    type: Boolean,
    default: false,
  },
  /**
   * Set the page view of the editor.
   */
  pageView: {
    type: String,
    default: 'page',
    validator: (value: string) => ['page', 'full'].includes(value),
  },
})

const emit = defineEmits<{
  /**
   * Emit when editor is fully initialized and ready.
   * @see https://tiptap.dev/docs/editor/api/events#list-of-available-events
   */
  (e: 'create', editor: Editor): void

  /**
   * Emit when content transaction.
   */
  (e: 'transaction', payload: { editor: Editor; transaction: object }): void

  /**
   * Emit when content updates.
   */
  (
    e: 'update',
    payload: { editor: Editor; language: string; code: string }
  ): void
}>()

const { tr, setLocale } = useI18n()
const darkModeAlt = ref(false)
const isEditable = ref(true)
const localeAlt = ref('en')
const ready = ref(false)
provide('darkMode', darkModeAlt)
provide('isEditable', isEditable)
provide('locale', localeAlt)

const editor = useEditor({
  editable: props.editable,
  content: props.content,
  autofocus: props.autofocus,
  extensions: buildExtensions(),
  onCreate: () => {
    ready.value = true
    emit('create', editor.value)
  },
  onUpdate: ({ editor }: EditorEvents['update']) => {
    if (!ready.value) return

    const codeJson = editor.getJSON().content[0] as JSONContent
    const language = codeJson.attrs?.language || ''
    const code = codeJson.content?.length > 0 ? codeJson.content[0].text : ''

    // Only emit update when editor is ready
    emit('update', { editor, language, code })
  },
  onTransaction: ({ editor, transaction }) => {
    emit('transaction', { editor, transaction })
  },
})

function buildExtensions() {
  const extensions = []

  // Default blocks
  extensions.push(
    Document.extend({
      content: 'codeBlock',
    })
  )
  extensions.push(
    StarterKit.configure({
      dropcursor: {
        width: 5,
        color: 'skyblue',
        class: 'yiitap-dropcursor',
      },
      codeBlock: false,
      document: false,
      horizontalRule: false,
      link: false,
      blockquote: false,
      trailingNode: false,
      undoRedo: { depth: 100, newGroupDelay: 500 },
    })
  )

  // Code
  extensions.push(OCodeBlock)
  extensions.push(OShortcut)
  extensions.push(Markdown)

  return extensions
}

watch(
  () => props.darkMode,
  (newValue) => {
    darkModeAlt.value = newValue
  }
)

watch(
  () => props.locale,
  (newValue) => {
    localeAlt.value = newValue
    setLocale(newValue)
    editor.value?.view.dispatch(editor.value?.view.state.tr)
  }
)

watch(
  () => props.editable,
  (newValue) => {
    editor.value?.setEditable(newValue)
    isEditable.value = newValue
  }
)

onBeforeMount(() => {
  isEditable.value = props.editable
  darkModeAlt.value = props.darkMode
  localeAlt.value = props.locale
  setLocale(props.locale)
  editor.value?.view.dispatch(editor.value?.view.state.tr)
})

defineExpose({
  /**
   * Editor instance. More about <a href="https://tiptap.dev/docs/editor/api/editor" target="_blank">editor api</a>.
   */
  editor,
  /**
   * Whether in dark mode
   */
  darkMode: darkModeAlt,
  /**
   * Current locale
   */
  locale: localeAlt,
})
</script>

<style lang="scss">
@use '../style/variables';
@use '../style/app';
@use '../style/tippy';
@use '../style/tiptap';
@use '../style/yiitap';
@import '../../../icon/dist/yiitap-icon.css';
//@import '../style/multi-column';
</style>

<template>
  <o-menubar-btn
    class="o-toggle-list-btn"
    icon="toggle_list"
    :tooltip="tr('editor.toggleList')"
    :content-class="{
      'is-active': editor?.isActive('toggleHead', { level: 0 }),
    }"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Editor } from '@tiptap/core'
import OMenubarBtn from '../common/OMenubarBtn.vue'
import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
  },
})
const { run } = useTiptap()
const { tr } = useI18n()

function onClick() {
  run(props.editor, 'toggleBlockToggle', { level: 0 })
}
</script>

<style lang="scss">
.o-toggle-list-btn {
}
</style>

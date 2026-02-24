<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    content-class="dropdown"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-command-btn
        icon="extension"
        content-class="o-extension-dropdown dropdown"
        :tooltip="tr('editor.textFormat')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-divider v-if="item.separator" />
        <o-list-item
          :class="{ 'is-active': editor?.isActive(item.value) }"
          @click="onSelect(item.value)"
        >
          {{ item.label }}
          <template #prefix>
            <o-icon :name="item.icon" />
          </template>
          <template #suffix>
            <o-icon name="done" small v-if="editor?.isActive(item.value)" />
          </template>
        </o-list-item>
      </template>
    </o-list>
  </o-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Editor } from '@tiptap/core'
import {
  OCommandBtn,
  ODivider,
  OIcon,
  OList,
  OListItem,
  OPopover,
} from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()

const options = computed(() => {
  return [
    {
      label: tr('editor.photo'),
      value: 'image',
      icon: 'image',
    },
    {
      label: tr('editor.video'),
      value: 'video',
      icon: 'videocam',
    },
    {
      label: tr('editor.inlineMath'),
      value: 'inlineMath',
      icon: 'function',
      separator: true,
    },
    {
      label: tr('editor.blockMath'),
      value: 'blockMath',
      icon: 'functions',
    },
    {
      label: tr('diagram.name'),
      value: 'diagram',
      icon: 'mermaid',
      separator: true,
    },
    {
      label: tr('editor.multiColumn'),
      value: 'multiColumn',
      icon: 'view_column',
      separator: true,
    },
  ]
})

function onSelect(value: string) {
  popover.value?.setShow(false)
  run(props.editor as Editor, value)
}
</script>

<style lang="scss">
.o-extension-dropdown {
}
</style>

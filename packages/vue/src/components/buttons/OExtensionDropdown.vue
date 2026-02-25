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
        :tooltip="tr('label.more')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-divider v-if="item.separator" />
        <div class="group o-tips" v-if="item.group && false">
          {{ item.group }}
        </div>
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
      label: tr('editor.multiColumn'),
      value: 'multiColumn',
      icon: 'view_column',
    },
    {
      label: tr('diagram.name'),
      value: 'diagram',
      icon: 'mermaid',
      separator: true,
    },
    {
      label: tr('label.image'),
      value: 'image',
      icon: 'image',
      group: tr('label.media'),
      separator: true,
    },
    {
      label: tr('label.video'),
      value: 'video',
      icon: 'videocam',
    },
    {
      label: tr('label.audio'),
      value: 'audio',
      icon: 'graphic_eq',
    },
    {
      label: tr('label.model3d'),
      value: 'modelViewer',
      icon: '3d_rotation',
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

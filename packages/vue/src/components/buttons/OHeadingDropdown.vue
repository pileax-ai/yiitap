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
        icon="format_header_pound"
        content-class="o-heading-dropdown dropdown"
        :tooltip="tr('editor.heading')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-divider v-if="item.separator" />
        <o-list-item
          :class="{ 'is-active': isActive(item) }"
          @click="onSelect(item)"
        >
          {{ item.label }}
          <template #prefix>
            <o-icon :name="item.icon" />
          </template>
          <template #suffix>
            <o-icon name="done" small v-if="isActive(item)" />
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
    type: Object,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref(null)

const options = computed(() => {
  return [
    {
      label: tr('editor.paragraph'),
      value: 'paragraph',
      level: '',
      icon: 'title',
    },
    {
      label: tr('editor.heading1'),
      value: 'heading',
      level: 1,
      icon: 'format_h1',
      separator: true,
    },
    {
      label: tr('editor.heading2'),
      value: 'heading',
      level: 2,
      icon: 'format_h2',
    },
    {
      label: tr('editor.heading3'),
      value: 'heading',
      level: 3,
      icon: 'format_h3',
    },
    {
      label: tr('editor.heading4'),
      value: 'heading',
      level: 4,
      icon: 'format_h4',
    },
    {
      label: tr('editor.heading5'),
      value: 'heading',
      level: 5,
      icon: 'format_h5',
    },
    {
      label: tr('editor.toggleHeading1'),
      value: 'toggleBlock',
      valueAlt: 'toggleBlockToggle',
      level: 0,
      icon: 'format_toggle_h1',
      separator: true,
    },
    {
      label: tr('editor.toggleHeading1'),
      value: 'toggleBlock',
      valueAlt: 'toggleBlockToggle',
      level: 1,
      icon: 'format_toggle_h1',
      separator: true,
    },
    {
      label: tr('editor.toggleHeading2'),
      value: 'toggleBlock',
      valueAlt: 'toggleBlockToggle',
      level: 2,
      icon: 'format_toggle_h2',
    },
    {
      label: tr('editor.toggleHeading3'),
      value: 'toggleBlock',
      valueAlt: 'toggleBlockToggle',
      level: 3,
      icon: 'format_toggle_h3',
    },
  ]
})

function isActive(item: Indexable) {
  switch (item.value) {
    case 'heading':
      return props.editor?.isActive('heading', { level: item.level })
    case 'toggleBlock':
      return props.editor?.isActive('toggleHead', { level: item.level })
    default:
      props.editor?.isActive(item.value)
  }
}

function onSelect(item: Indexable) {
  popover.value?.setShow(false)
  run(props.editor as Editor, item.valueAlt || item.value, {
    level: item.level,
  })
}
</script>

<style lang="scss">
.o-heading-dropdown {
}
</style>

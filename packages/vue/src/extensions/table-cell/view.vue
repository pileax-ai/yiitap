<template>
  <node-view-wrapper
    class="o-table-cell-view"
    as="td"
    v-bind="node.attrs"
    :style="{ background: node.attrs.background }"
    @mouseenter="onCellMouseEnter"
    @mouseleave="onCellMouseLeave"
  >
    <template v-if="isEditable">
      <o-table-cell-handler
        v-model="showColPopover"
        :offset="[0, 8]"
        :tooltip="tr('table.addColumn')"
        placement="bottom"
        column
        @add="runCommand('tableAddColumn')"
        v-if="showColumnHandler"
      >
        <o-list hoverable clickable>
          <template v-for="(item, index) in columnActions" :key="index">
            <o-list-item @click="runCommand(item.value)">
              {{ item.label }}
              <template #prefix>
                <o-icon :name="item.icon" :class="item.class" />
              </template>
            </o-list-item>
          </template>
        </o-list>
      </o-table-cell-handler>

      <o-table-cell-handler
        v-model="showRowPopover"
        :offset="[0, 10]"
        :tooltip="tr('table.addRow')"
        placement="right-start"
        :tooltip-offset="[0, 2]"
        tooltip-placement="left"
        @add="runCommand('tableAddRow')"
        row
        v-if="showRowHandler"
      >
        <o-list hoverable clickable>
          <template v-for="(item, _index) in rowActions" :key="_index">
            <o-list-item @click="runCommand(item.value)">
              {{ item.label }}
              <template #prefix>
                <o-icon :name="item.icon" :class="item.class" />
              </template>
            </o-list-item>
          </template>
        </o-list>
      </o-table-cell-handler>

      <o-table-cell-bubble
        :menus="cellBubbleMenus"
        placement="right"
        @select="onSelect"
        v-if="showCellBubble && !isCellFocused"
      />
    </template>

    <node-view-content />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { jsonToHTML, jsonToMarkdown } from '@yiitap/extension-shortcut'

import {
  OIcon,
  OList,
  OListItem,
  OTableCellBubble,
  OTableCellHandler,
} from '../../components/index'

import { useI18n, useTable } from '../../hooks'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const {
  showColPopover,
  showRowPopover,
  columnActions,
  rowActions,
  isEditable,
  cellInfo,
  initProps,
  runCommand,
} = useTable()
const showColumnHandler = ref(false)
const showRowHandler = ref(false)
const showCellBubble = ref(false)
const copyIcon = ref('copy')

const isCellFocused = computed(() => {
  const pos = props.getPos()
  if (typeof pos !== 'number') return false

  const cellStart = pos + 1
  const cellEnd = pos + props.node.nodeSize - 1
  const { from, to } = props.editor.state.selection

  return from >= cellStart && to <= cellEnd
})

const cellBubbleMenus = computed(() => {
  return [{ tooltip: tr('label.copy'), value: 'copy', icon: copyIcon.value }]
})

function onCellMouseEnter() {
  showCellBubble.value = true
}

function onCellMouseLeave() {
  showCellBubble.value = false
}

function onSelect(item: Indexable) {
  switch (item.value) {
    case 'copy':
      copyContent()
      break
  }
}

function copyContent() {
  try {
    const json = props.node.toJSON()
    const html = jsonToHTML(json.content, props.editor)
    const markdown = jsonToMarkdown(json.content, props.editor)
    const writeData: Indexable = {
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([markdown], { type: 'text/plain' }),
    }
    const item = new ClipboardItem(writeData)
    navigator.clipboard.write([item]).then(() => {
      copyIcon.value = 'done'
      setTimeout(() => {
        copyIcon.value = 'copy'
      }, 1000)
    })
  } catch (err) {
    console.error('Clipboard write failed.', err)
  }
}

onMounted(() => {
  initProps({
    getPos: props.getPos,
    editor: props.editor,
  })
  showColumnHandler.value = cellInfo.value.rowIndex === 0
  showRowHandler.value = cellInfo.value.colIndex === 0
})
</script>

<style lang="scss">
.o-table-cell-view {
  position: relative;
}
</style>

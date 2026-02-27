<template>
  <node-view-wrapper
    class="o-table-cell-view"
    as="td"
    v-bind="node.attrs"
    :style="{ background: node.attrs.background }"
  >
    <template v-if="isEditable">
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
          <template v-for="(item, index) in rowActions" :key="index">
            <o-list-item @click="runCommand(item.value)">
              {{ item.label }}
              <template #prefix>
                <o-icon :name="item.icon" :class="item.class" />
              </template>
            </o-list-item>
          </template>
        </o-list>
      </o-table-cell-handler>
    </template>

    <node-view-content />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

import {
  OBlockPopover,
  OIcon,
  OList,
  OListItem,
  OTableCellHandler,
  OTooltip,
} from '../../components/index'

import { useI18n, useTable } from '../../hooks'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const {
  showRowPopover,
  rowActions,
  isEditable,
  cellInfo,
  initProps,
  runCommand,
} = useTable()
const showRowHandler = ref(false)

onMounted(() => {
  initProps({
    getPos: props.getPos,
    editor: props.editor,
  })
  showRowHandler.value = cellInfo.value.colIndex === 0
})
</script>

<style lang="scss">
.o-table-cell-view {
  position: relative;
}
</style>

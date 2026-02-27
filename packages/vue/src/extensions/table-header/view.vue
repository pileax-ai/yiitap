<template>
  <node-view-wrapper
    class="o-table-header-view"
    as="th"
    v-bind="node.attrs"
    :style="{ background: node.attrs.background }"
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
        row
        @add="runCommand('tableAddRow')"
        v-if="showRowHandler"
      >
        <o-list hoverable clickable>
          <template
            v-for="(item, index) in rowActions.filter(
              (r) => r.value !== 'tableAddRowBefore'
            )"
            :key="index"
          >
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
  OIcon,
  OList,
  OListItem,
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
.o-table-header-view {
  position: relative;
  padding-top: 20px;
  z-index: 0;
}
</style>

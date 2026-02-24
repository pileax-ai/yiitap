<template>
  <node-view-wrapper class="o-node-view" :data-id="node.attrs['id']">
    <slot></slot>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

defineProps(nodeViewProps)
</script>

<style lang="scss">
.o-node-view {
  position: relative;

  //  hover
  // --------------------------------------------------
  &:hover {
    .action-container {
      visibility: visible;
    }

    .o-block-toolbar {
      visibility: visible;
    }
  }

  &:has(.is-dragging) {
    .o-block-toolbar,
    .caption,
    .col-handler,
    .row-handler {
      display: none !important;
    }

    .tableWrapper {
      padding: 10px;
      margin: 0;
    }
  }
}
</style>

<template>
  <div class="o-table-cell-bubble">
    <div class="menus o-shadow-1">
      <template v-for="(item, index) in menus" :key="index">
        <o-command-btn v-bind="item" @click="emit('select', item)" />
      </template>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type PropType } from 'vue'

import { OCommandBtn } from '../../components/index'

const props = defineProps({
  menus: {
    type: Array as PropType<Indexable[]>,
    default: () => [],
    required: true,
  },
  placement: {
    type: String,
    default: 'top',
  },
  contentClass: {
    type: [String, Object],
    default: '',
  },
})
const emit = defineEmits(['select'])

onMounted(() => {})
</script>

<style lang="scss">
.o-table-cell-bubble {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: end;
  align-items: center;

  .menus {
    display: flex;
    margin: 0 4px;
    padding: 2px;
    border-radius: 4px;

    .o-command-btn {
      width: 20px;
      height: 20px;

      .o-icon {
        font-size: 14px;
      }
    }
  }
}
</style>

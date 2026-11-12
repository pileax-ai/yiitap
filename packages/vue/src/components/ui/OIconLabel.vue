<template>
  <div class="o-icon-label">
    <o-icon :name="icon" :class="iconClass" v-if="icon" />
    <div>
      {{ label }}
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OIcon } from '../index'

defineProps({
  icon: {
    type: String,
    default: '',
  },
  iconClass: {
    type: [String, Object],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss">
.o-icon-label {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  .o-icon {
    margin-right: 2px;
  }
}
</style>

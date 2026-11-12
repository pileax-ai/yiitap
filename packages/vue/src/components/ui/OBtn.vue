<template>
  <button
    class="o-btn"
    :class="{ [`type-${type}`]: type }"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <template v-if="loading">
      <div class="spinner"></div>
    </template>
    <template v-else>
      <o-icon :name="icon" :class="iconClass" v-if="icon" />
    </template>
    <span class="o-btn__label" v-if="label">{{ label }}</span>
    <slot></slot>
  </button>
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
  type: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['click'])
</script>

<style lang="scss">
.o-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  height: 36px;
  border-radius: 3px;
  box-sizing: border-box;
  color: var(--yii-color);

  &:hover {
    background: var(--yii-hover-bg-color) !important;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.type-tertiary {
    color: var(--yii-color);
    border: solid 1px var(--yii-border-color);
  }

  &.type-info {
    color: #ffffff;
    background: #2080f0;

    &:hover {
      background: #4098fc !important;
    }
  }

  &__label,
  .label {
    margin-left: 4px;
    color: var(--yii-tips-color);
  }
}
</style>

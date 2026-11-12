<template>
  <section class="o-block-placeholder" :class="{ autogrow }">
    <div class="left">
      <div class="icon">
        <o-icon :name="icon" />
      </div>
      <div class="placeholder">
        <o-tooltip class="o-tooltip" v-if="tooltip">
          <template #trigger>
            {{ placeholder }}
          </template>
          {{ placeholder }}
        </o-tooltip>
        <template v-else>
          {{ placeholder }}
        </template>

        <slot></slot>
      </div>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { OIcon, OTooltip } from '../index'

const props = defineProps({
  icon: {
    type: String,
    default: 'image',
  },
  placeholder: {
    type: String,
    default: '',
  },
  tooltip: {
    type: Boolean,
    default: false,
  },
  autogrow: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-block-placeholder {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border-radius: 4px;
  color: var(--yii-tips-color);
  background: var(--yii-active-bg-color);
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;

  &.attachment {
    color: var(--yii-color);
  }

  .left {
    flex: 1;
    display: flex;
    align-items: stretch;
    min-width: 0;
  }

  .icon {
    display: flex;
    align-items: start;
    margin-right: 8px;
    padding: 5px 0;
  }

  .placeholder {
    flex: 1;
    display: block;
    align-items: center;
    width: 100%;
    max-width: 500px;
    min-width: 0;
    height: 30px;
    min-height: 30px;
    line-height: 30px;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .o-tooltip {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &.autogrow {
    .placeholder {
      display: inline-flex;
      align-items: center;
      height: unset !important;
      line-height: unset !important;
      max-width: unset !important;
    }
  }
}

.o-block-placeholder-popover {
  .meta-input {
    min-width: 500px;
    padding: 14px 4px;

    .actions {
      display: flex;
      justify-content: center;
      padding-top: 1rem;

      .n-button {
        min-width: 120px;
      }
    }
  }
}
</style>

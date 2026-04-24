<template>
  <section class="o-block-placeholder">
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
})
</script>

<style lang="scss">
.o-block-placeholder {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 8px;
  }

  .placeholder {
    height: 30px;
    line-height: 30px;
    font-size: 0.9rem;
    max-width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .o-tooltip {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

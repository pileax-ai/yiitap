<template>
  <teleport to="body">
    <div
      class="dialog-overlay o-dialog"
      :class="dialogClass"
      @click.self="close"
      v-if="show"
    >
      <div class="dialog-box" :class="{ fullscreen: fullscreen }">
        <div class="dialog-header">
          <slot name="title">{{ title }}</slot>
          <o-btn icon="close" class="close" @click="close" />
        </div>
        <div class="dialog-body">
          <slot></slot>
        </div>
        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineOptions({ name: 'ODialog' })

import type { DialogOption } from '../../types/types'
import { OBtn } from '../index'

const props = defineProps<DialogOption>()

const emits = defineEmits(['close', 'update:show'])

const close = () => {
  emits('update:show', false)
  emits('close')
}
</script>

<style lang="scss">
.o-dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;

  .dialog-box {
    display: flex;
    flex-direction: column;
    position: relative;
    background: var(--yii-bg-color);
    border-radius: 8px;
    width: auto;
    min-width: 50vw;
    min-height: 50vh;
    height: 50vh;
    max-width: 90vw;
    max-height: 90vh;
    resize: both;
    overflow: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

    &.fullscreen {
      height: 100vh;
      width: 100vw;
      max-width: unset;
      max-height: unset;
      border-radius: 0;
    }

    .dialog-body {
      position: relative;
      display: flex;
      flex: 1;
      padding: 0;
      overflow: hidden;

      iframe {
        display: block;
        flex: 1;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        border: 0;
        margin: 0;
      }
    }

    .dialog-header,
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dialog-header {
      height: 40px;
      padding: 0 1rem;
      color: var(--yii-tips-color);
      background: var(--yii-pre-tool-bg-color);

      .o-btn.close {
        position: absolute;
        right: 0.5rem;
        padding: 4px;
        height: 30px;
        width: 30px;
      }
    }
  }
}
</style>

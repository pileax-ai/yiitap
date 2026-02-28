<template>
  <div
    class="o-table-cell-handler"
    :class="{ 'o-row': row, 'o-column': column }"
    @click="onClickHandler"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="placement"
      :tippy-class="tippyClass"
      :offset="offset"
      hide-click-outside
      @update:modelValue="onUpdated"
    >
      <section
        class="handler-trigger"
        :class="`${contentClass} ${showPopover ? 'active' : ''}`"
        @click="onClickHandler"
      >
        <div class="handler">
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="10" r="2" />
            <circle cx="12" cy="2" r="2" />
            <circle cx="12" cy="10" r="2" />
            <circle cx="22" cy="2" r="2" />
            <circle cx="22" cy="10" r="2" />
          </svg>
        </div>
      </section>
      <template #popover-content>
        <slot></slot>
      </template>
    </o-block-popover>

    <div class="add">
      <div class="indicator">
        <svg width="3" height="3" viewBox="0 0 3 3" fill="none">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#BBBFC4"></circle>
        </svg>
      </div>

      <o-tooltip :placement="tooltipPlacement" :offset="tooltipOffset">
        <template #trigger>
          <div class="circle-button" @click.stop="emit('add')">
            <div class="plus"></div>
          </div>
        </template>
        {{ tooltip }}
      </o-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OBlockPopover, OTooltip } from '../index'
import { onMounted, type PropType, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
  },
  offset: {
    type: Object as PropType<[number, number]>,
    default: function () {
      return [0, 0] as [number, number]
    },
  },
  tippyClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: [String, Object],
    default: '',
  },
  tooltipPlacement: {
    type: String,
    default: 'top',
  },
  tooltipOffset: {
    type: Object as PropType<[number, number]>,
    default: function () {
      return [0, 2] as [number, number]
    },
  },
})
const emit = defineEmits(['update:modelValue', 'add'])

const showPopover = ref(false)

function onClickHandler() {
  setTimeout(() => {
    showPopover.value = true
  }, 0)
}

function onUpdated(value: boolean) {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    showPopover.value = newValue
  }
)

onMounted(() => {
  showPopover.value = props.modelValue
})
</script>

<style lang="scss">
.o-table-cell-handler {
  position: absolute;
  top: -5px;
  left: 0;
  z-index: 1001;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  //background: var(--yii-table-handler-bg-color);

  &:hover {
    .handler-trigger {
      visibility: visible;
    }
  }

  &:has(.add:hover) {
    .handler-trigger {
      visibility: hidden;
    }
  }

  .add {
    position: absolute;
    height: 30px;
    width: 30px;
    z-index: 1002;
    line-height: 0.3;
    cursor: pointer;

    &:hover {
      .circle-button {
        visibility: visible;
      }
      .indicator {
        visibility: hidden;
      }
    }

    .indicator {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      color: var(--yii-tips-color);
      width: 100%;
      height: 20px;
      padding-bottom: 4px;
      justify-content: center;
      align-items: end;
      visibility: hidden;
    }

    .circle-button {
      position: relative;
      top: 10px;
      left: 4.5px;
      width: 20px;
      height: 20px;
      background-color: dodgerblue;
      visibility: hidden;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);

      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: rotate(-45deg) scale(1.2);
        background-color: dodgerblue;
      }

      .plus {
        position: relative;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);

        &::before,
        &::after {
          content: '';
          position: absolute;
          background-color: white;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &::before {
          width: 8px;
          height: 2px;
        }

        &::after {
          width: 2px;
          height: 8px;
        }
      }
    }
  }

  .handler-trigger {
    position: relative;
    width: 20px;
    height: 16px;
    padding: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;

    &.active {
      visibility: visible;
    }

    .handler {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border-radius: 4px;
      background: var(--yii-bg-color);
      color: var(--yii-tips-color);
      border: solid 1px var(--yii-divider-bg-color);

      svg {
        height: 6px;
      }
    }
  }

  &.o-column {
    right: -1px;
    height: 10px;

    .add {
      top: -30px;
      right: -15px;
    }
  }

  &.o-row {
    width: 10px;
    top: 0;
    bottom: -1px;
    left: -5px;

    .add {
      left: -30px;
      bottom: -15px;

      .indicator {
        height: 100%;
        width: 20px;
        padding-right: 4px;
        justify-content: flex-end;
        align-items: center;
      }

      .circle-button {
        position: relative;
        top: 4.5px;
        left: 10px;
        border-radius: 50% 0 50% 50%;
        transform: rotate(45deg);

        &:hover {
          transform: rotate(45deg) scale(1.2);
        }
      }
    }

    .handler-trigger {
      width: 16px;
      height: 20px;
      padding: 5px 0;

      .handler {
        width: 100%;
        svg {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>

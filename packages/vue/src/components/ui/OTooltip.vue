<template>
  <div
    ref="triggerRef"
    class="o-tooltip"
    v-on="eventHandlers"
  >
    <slot name="trigger"></slot>

    <div
      v-if="isVisible"
      ref="contentRef"
      class="o-tooltip-content"
      @click.stop.prevent
    >
      <slot></slot>
      <div ref="arrowRef" class="o-tooltip-arrow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, type PropType, nextTick, computed } from 'vue'
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  type Placement
} from '@floating-ui/dom'

const props = defineProps({
  placement: {
    type: String,
    default: 'top'
  },
  trigger: {
    type: String,
    default: 'mouseenter focus'
  },
  delay: {
    type: Number,
    default: 100
  },
  duration: {
    type: Number,
    default: 150
  },
  offset: {
    type: Array as PropType<number[]>,
    default: () => [0, 10]
  }
})

const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()
const isVisible = ref(false)

let cleanup: (() => void) | null = null
let timer: ReturnType<typeof setTimeout> | null = null

// Event logic mapping
const eventHandlers = computed(() => {
  const handlers: Record<string, Function> = {}
  if (props.trigger.includes('mouseenter')) {
    handlers.mouseenter = show
    handlers.mouseleave = hide
  }
  if (props.trigger.includes('focus')) {
    handlers.focusin = show
    handlers.focusout = hide
  }
  if (props.trigger.includes('click')) {
    handlers.click = () => (isVisible.value ? hide() : show())
  }
  return handlers
})

const updatePosition = () => {
  if (!triggerRef.value || !contentRef.value) return

  computePosition(triggerRef.value, contentRef.value, {
    placement: props.placement as Placement,
    middleware: [
      offset(props.offset[1]),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef.value! })
    ]
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(contentRef.value!.style, {
      left: `${x}px`,
      top: `${y}px`
    })

    // Arrow positioning
    if (middlewareData.arrow && arrowRef.value) {
      const { x: ax, y: ay } = middlewareData.arrow
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]] as string

      Object.assign(arrowRef.value.style, {
        left: ax != null ? `${ax}px` : '',
        top: ay != null ? `${ay}px` : '',
        [staticSide]: '-4px' // Half of arrow height
      })
    }
  })
}

const show = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    isVisible.value = true
    nextTick(() => {
      if (triggerRef.value && contentRef.value) {
        cleanup = autoUpdate(triggerRef.value, contentRef.value, updatePosition)
      }
    })
  }, props.delay)
}

const hide = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    isVisible.value = false
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }, 150) // Small buffer for "interactive" feel
}

onUnmounted(() => {
  cleanup?.()
  if (timer) clearTimeout(timer)
})
</script>

<style lang="scss">
.o-tooltip {
  display: inline-block;

  &-content {
    // Base Style
    position: fixed;
    z-index: 1000;
    padding: 5px 9px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: auto;

    // Animation: Mimic Tippy perspective
    animation: o-tooltip-perspective v-bind('props.duration + "ms"') ease-out;
    transform-origin: center bottom;
    background-color: var(--yii-tippy-tooltip-bg-color);
    color: var(--yii-tippy-tooltip-color);
  }

  &-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    z-index: -1;
    background: var(--yii-tippy-tooltip-bg-color);
  }
}

@keyframes o-tooltip-perspective {
  from {
    opacity: 0;
    transform: perspective(700px) translateY(10px) rotateX(-15deg) scale(0.9);
  }
  to {
    opacity: 1;
    transform: perspective(700px) translateY(0) rotateX(0) scale(1);
  }
}
</style>

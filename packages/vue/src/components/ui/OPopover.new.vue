<template>
  <div ref="wrapperRef" class="o-popover-wrapper" v-on="triggerEvents">
    <div ref="triggerRef" class="o-popover-trigger">
      <slot name="trigger"></slot>
    </div>

    <Teleport to="body">
      <Transition name="shift-away">
        <div
          v-if="!disable && isVisible"
          ref="contentRef"
          class="o-popover"
          :class="[contentClass, theme]"
          :style="floatingStyles"
          :data-placement="currentPlacement"
          @mouseenter="onContentMouseEnter"
          @mouseleave="onContentMouseLeave"
        >
          <slot></slot>
          <div v-if="arrow" ref="arrowRef" class="o-popover-arrow" :style="arrowStyles"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onUnmounted, type PropType, type CSSProperties } from 'vue'
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow as arrowModifier,
  type Placement
} from '@floating-ui/dom'
import { useTheme } from '../../hooks'

const props = defineProps({
  disable: { type: Boolean, default: false },
  arrow: { type: Boolean, default: false },
  offset: {
    type: [Number, Object] as PropType<number | { mainAxis?: number; crossAxis?: number }>,
    default: 10,
  },
  placement: { type: String as PropType<Placement>, default: 'bottom-start' },
  trigger: { type: String, default: 'mouseenter focus' },
  contentClass: { type: String, default: '' },
  event: {
    type: Object as PropType<{ clientX: number; clientY: number } | null>,
    default: null,
  },
  // 增加延迟控制，防止鼠标移动到内容区时消失
  hideDelay: { type: Number, default: 150 },
})

const emit = defineEmits(['update:show'])
const { theme } = useTheme()

const isVisible = ref(false)
const currentPlacement = ref<Placement>(props.placement)
const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const floatingStyles = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: 2000,
  width: 'max-content',
})
const arrowStyles = ref<CSSProperties>({})

let cleanup: (() => void) | undefined
let hideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 核心逻辑：显示与隐藏控制
 */
const setShow = (show: boolean, immediate = false) => {
  if (props.disable) return

  // 清除现有的计时器
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  if (show) {
    isVisible.value = true
    emit('update:show', true)
  } else {
    if (immediate) {
      isVisible.value = false
      emit('update:show', false)
    } else {
      // 延迟关闭，给鼠标移动留出时间
      hideTimer = setTimeout(() => {
        isVisible.value = false
        emit('update:show', false)
        hideTimer = null
      }, props.hideDelay)
    }
  }
}

// 鼠标进入内容区：取消隐藏计划
const onContentMouseEnter = () => {
  if (props.trigger.includes('mouseenter')) {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }
}

// 鼠标离开内容区：开始隐藏计划
const onContentMouseLeave = () => {
  if (props.trigger.includes('mouseenter')) {
    setShow(false)
  }
}

const updatePosition = async () => {
  if (!triggerRef.value || !contentRef.value) return

  const referenceEl = props.event ? {
    getBoundingClientRect() {
      return {
        width: 0, height: 0,
        x: props.event!.clientX, y: props.event!.clientY,
        top: props.event!.clientY, left: props.event!.clientX,
        right: props.event!.clientX, bottom: props.event!.clientY,
      }
    }
  } : triggerRef.value

  const { x, y, placement, middlewareData } = await computePosition(
    referenceEl as any,
    contentRef.value,
    {
      placement: props.placement,
      middleware: [
        offset(props.offset),
        flip(),
        shift({ padding: 5 }),
        props.arrow && arrowRef.value ? arrowModifier({ element: arrowRef.value }) : null,
      ].filter(Boolean) as any,
    }
  )

  currentPlacement.value = placement
  Object.assign(floatingStyles.value, {
    left: `${x}px`,
    top: `${y}px`,
  })

  if (props.arrow && middlewareData.arrow) {
    const { x: ax, y: ay } = middlewareData.arrow
    const side = placement.split('-')[0]
    const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side]!
    arrowStyles.value = {
      left: ax != null ? `${ax}px` : '',
      top: ay != null ? `${ay}px` : '',
      [staticSide]: '-4px',
    }
  }
}

const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!wrapperRef.value?.contains(target) && !contentRef.value?.contains(target)) {
    setShow(false, true) // 点击外部应立即消失
  }
}

watch(isVisible, (val) => {
  if (val) {
    setTimeout(() => document.addEventListener('click', handleOutsideClick), 0)
    nextTick(() => {
      if (triggerRef.value && contentRef.value) {
        cleanup = autoUpdate(triggerRef.value, contentRef.value, updatePosition)
      }
    })
  } else {
    document.removeEventListener('click', handleOutsideClick)
    cleanup?.()
    cleanup = undefined
  }
})

const triggerEvents = computed(() => {
  const events: Record<string, any> = {}
  if (props.disable) return events

  const types = props.trigger.split(' ')
  if (types.includes('mouseenter')) {
    events.mouseenter = () => setShow(true)
    events.mouseleave = () => setShow(false)
  }
  if (types.includes('click')) {
    events.click = (e: Event) => {
      e.stopPropagation()
      setShow(!isVisible.value, true)
    }
  }
  if (types.includes('focus')) {
    events.focusin = () => setShow(true)
    events.focusout = () => setShow(false)
  }
  return events
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
  document.removeEventListener('click', handleOutsideClick)
  cleanup?.()
})

defineExpose({ setShow })
</script>

<style scoped lang="scss">
.o-popover-wrapper {
  display: inline-block;
}

.o-popover {
  min-width: 180px;
  padding: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2),
  0 2px 2px rgba(0, 0, 0, 0.14),
  0 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  color: var(--yii-color);
  background: var(--yii-tippy-popover-bg-color);
  z-index: 2000;
  pointer-events: auto;


  &-arrow {
    position: absolute;
    background: inherit;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
}

.shift-away-enter-active,
.shift-away-leave-active {
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1),
  transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.shift-away-enter-from,
.shift-away-leave-to {
  opacity: 0;
  &[data-placement^='top'] { transform: translateY(10px); }
  &[data-placement^='bottom'] { transform: translateY(-10px); }
  &[data-placement^='left'] { transform: translateX(10px); }
  &[data-placement^='right'] { transform: translateX(-10px); }
}
</style>

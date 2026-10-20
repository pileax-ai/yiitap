<!-- components/ScrollArea.vue -->
<template>
  <div
    class="o-scroll-area"
    :style="{ '--qsa-max-height': maxHeight, '--qsa-bar-size': barSize + 'px' }"
  >
    <div
      ref="contentRef"
      class="o-scroll-area__content"
      @scroll.passive="onScroll"
    >
      <div ref="innerRef" class="o-scroll-area__inner">
        <slot />
      </div>
    </div>

    <div
      v-show="scrollable"
      class="o-scroll-area__bar"
      :class="{ 'is-dragging': dragging }"
    >
      <div
        class="o-scroll-area__thumb"
        :style="thumbStyle"
        @mousedown.prevent="onThumbDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    maxHeight?: string
    barSize?: number
    thumbMinSize?: number
  }>(),
  {
    maxHeight: '480px',
    barSize: 4,
    thumbMinSize: 24,
  }
)

const contentRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)

const scrollable = ref(false)
const dragging = ref(false)
const thumbHeight = ref(0)
const thumbTop = ref(0)

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translateY(${thumbTop.value}px)`,
}))

let ro: ResizeObserver | null = null
let rafId = 0

function update() {
  const el = contentRef.value
  if (!el) return

  const { clientHeight, scrollHeight } = el
  scrollable.value = scrollHeight > clientHeight + 1

  if (!scrollable.value) {
    thumbHeight.value = 0
    thumbTop.value = 0
    return
  }

  const ratio = clientHeight / scrollHeight
  thumbHeight.value = Math.max(props.thumbMinSize, clientHeight * ratio)

  const maxThumbTop = clientHeight - thumbHeight.value
  const maxScrollTop = scrollHeight - clientHeight
  thumbTop.value =
    maxScrollTop > 0 ? (el.scrollTop / maxScrollTop) * maxThumbTop : 0
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    const el = contentRef.value
    if (!el || !scrollable.value) return
    const { clientHeight, scrollHeight, scrollTop } = el
    const maxThumbTop = clientHeight - thumbHeight.value
    const maxScrollTop = scrollHeight - clientHeight
    thumbTop.value =
      maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0
  })
}

/* ---------------- Drag ---------------- */
let startY = 0
let startScrollTop = 0

function onThumbDown(e: MouseEvent) {
  const el = contentRef.value
  if (!el) return
  dragging.value = true
  startY = e.clientY
  startScrollTop = el.scrollTop
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
  document.addEventListener('mousemove', onThumbMove)
  document.addEventListener('mouseup', onThumbUp)
}

function onThumbMove(e: MouseEvent) {
  const el = contentRef.value
  if (!el) return
  const maxThumbTop = el.clientHeight - thumbHeight.value
  const maxScrollTop = el.scrollHeight - el.clientHeight
  if (maxThumbTop <= 0 || maxScrollTop <= 0) return
  const scrollDelta = ((e.clientY - startY) / maxThumbTop) * maxScrollTop
  el.scrollTop = startScrollTop + scrollDelta
}

function onThumbUp() {
  dragging.value = false
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  document.removeEventListener('mousemove', onThumbMove)
  document.removeEventListener('mouseup', onThumbUp)
}

onMounted(() => {
  nextTick(update)
  if (contentRef.value && innerRef.value) {
    ro = new ResizeObserver(() => update())
    ro.observe(contentRef.value)
    ro.observe(innerRef.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
  onThumbUp()
})
</script>

<style lang="scss">
.o-scroll-area {
  position: relative;
  max-height: var(--qsa-max-height);
  overflow: hidden;

  &__content {
    max-height: var(--qsa-max-height);
    overflow: auto;
    overscroll-behavior: contain;

    // Hide native scrollbar
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__inner {
    // Content container
  }

  &__bar {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;
    width: var(--qsa-bar-size);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 1;
  }

  &:hover &__bar,
  &__bar.is-dragging {
    opacity: 1;
    pointer-events: auto;
  }

  &__thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-radius: calc(var(--qsa-bar-size) / 2);
    background: var(--yii-divider-bg-color, rgba(0, 0, 0, 0.25));
    cursor: pointer;
    will-change: transform;
    transition: background 0.2s ease;

    &:hover {
      background: var(--yii-divider-bg-color, rgba(0, 0, 0, 0.4));
    }
  }

  &__bar.is-dragging &__thumb {
    background: var(--yii-divider-bg-color, rgba(0, 0, 0, 0.4));
  }
}
</style>

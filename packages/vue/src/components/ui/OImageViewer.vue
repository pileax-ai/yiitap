<template>
  <teleport to="body">
    <div v-if="show" class="dialog-overlay o-image-viewer">
      <header>
        <o-btn icon="close" @click="onClose" />
      </header>

      <div class="dialog-box">
        <div class="dialog-body">
          <div
            class="image-container"
            ref="imageContainerRef"
            @wheel.prevent="onWheel"
            @dblclick="resetZoom"
          >
            <img
              ref="imageRef"
              :src="currentImage.attrs.src"
              alt="image"
              :style="imageStyle"
              @mousedown="onMouseDown"
            />
          </div>
        </div>
      </div>

      <footer>
        <div class="action-group">
          <o-btn icon="arrow_back"
                 :class="{'disabled': currentIndex <= 0}"
                 @click="onPrevious" />
          <o-btn icon="arrow_back"
                 icon-class="rotate-180"
                 :class="{'disabled': currentIndex >= props.images.length - 1}"
                 @click="onNext" />
        </div>
        <div class="action-group">
          <o-btn icon="horizontal_rule" @click="zoomOut" />
          <div class="o-btn scale">{{ scalePercent }}%</div>
          <o-btn icon="add" @click="zoomIn" />
          <o-btn icon="download" @click="onDownload" />
          <o-btn icon="close" @click="onClose" />
        </div>
      </footer>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useCommon } from '../../hooks'

defineOptions({ name: 'ODialog' })

import {ref, defineProps, defineEmits, onMounted, computed, watch, onBeforeUnmount} from 'vue'
import { OBtn } from '../index'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  images: {
    type: Array as () => EditorImage[],
    default: () => []
  },
  current: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits(['update:show'])

const { downloadImage } = useCommon()
const currentIndex = ref(0)
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageRef = ref<HTMLImageElement | null>(null)
const imageContainerRef = ref<HTMLDivElement | null>(null)

const ZOOM_CONFIG = {
  MIN_SCALE: 0.1,
  MAX_SCALE: 10,
  STEP: 0.1,
  WHEEL_SENSITIVITY: 0.001
}

const currentImage = computed(() => {
  const len = props.images.length
  let value = {}
  if (len > 0) {
    value = currentIndex.value >= 0 && currentIndex.value < len
      ? props.images.at(currentIndex.value)
      : props.images.at(0)
  }

  return value as EditorImage
})

const imageStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
  transformOrigin: 'center center',
  cursor: isDragging.value ? 'grabbing' : (scale.value > 1 ? 'grab' : 'default')
}))

const scalePercent = computed(() => {
  return parseInt(`${scale.value * 100}`)
})

const onWheel = (event: WheelEvent) => {
  event.preventDefault()

  const delta = -event.deltaY * ZOOM_CONFIG.WHEEL_SENSITIVITY

  let newScale = scale.value + delta
  newScale = Math.max(ZOOM_CONFIG.MIN_SCALE, Math.min(ZOOM_CONFIG.MAX_SCALE, newScale))

  if (imageContainerRef.value && imageRef.value) {
    const rect = imageContainerRef.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - rect.width / 2
    const mouseY = event.clientY - rect.top - rect.height / 2

    const scaleDiff = newScale - scale.value
    position.value.x -= mouseX * scaleDiff
    position.value.y -= mouseY * scaleDiff
  }

  scale.value = newScale
}

const onMouseDown = (event: MouseEvent) => {
  if (scale.value <= 1) return

  event.preventDefault()
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return

  position.value.x = event.clientX - dragStart.value.x
  position.value.y = event.clientY - dragStart.value.y
}

const onMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const zoomIn = () => {
  scale.value = Math.min(ZOOM_CONFIG.MAX_SCALE, scale.value + ZOOM_CONFIG.STEP)
}

const zoomOut = () => {
  scale.value = Math.max(ZOOM_CONFIG.MIN_SCALE, scale.value - ZOOM_CONFIG.STEP)
}

const resetZoom = () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
}

const onPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    resetZoom()
  }
}

const onNext = () => {
  if (currentIndex.value < props.images.length - 1 ) {
    currentIndex.value += 1
    resetZoom()
  }
}

const onClose = () => {
  resetZoom()
  emits('update:show', false)
}

const onDownload = () => {
  downloadImage(currentImage.value.attrs?.src)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!props.show) return
  event.preventDefault()
  event.stopPropagation()

  switch(event.key) {
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
    case 'ArrowLeft':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        onPrevious()
      }
      break
    case 'ArrowRight':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        onNext()
      }
      break
    case 'Escape':
      onClose()
      break
  }
}

watch(() => props.current, (newValue) => {
  currentIndex.value = newValue
  resetZoom()
})

onMounted(() => {
  currentIndex.value = props.current
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style lang="scss">
.o-image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  user-select: none;

  .dialog-box {
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 8px;
    min-width: 75vw;
    min-height: 75vh;
    height: 100vh;
    width: 100vw;
    resize: both;
    overflow: auto;

    .dialog-body {
      display: flex;
      flex: 1;
      padding: 0;
      overflow: hidden;
      justify-content: center;
      align-items: center;

      .image-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
          max-width: 100%;
          max-height: 100%;
          transition: transform 0.1s ease;
          object-fit: contain;
          border-radius: 4px;
        }
      }
    }
  }

  header {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    z-index: 10001;

    .o-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      color: rgba(#ffffff, 0.5);
      background: rgba(0,0,0, 0.3);

      &:hover {
        color: #ffffff;
        background: rgba(0,0,0, 0.6) !important;
      }
    }
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    z-index: 10001;
    display: flex;
    justify-content: center;
    align-items: center;

    .action-group {
      display: flex;
      border-radius: 8px;
      backdrop-filter: blur(10px);
      background: rgba(0, 0, 0, 0.5);

      &:not(:first-child) {
        margin-left: 1rem;
      }

      .o-btn {
        width: 36px;
        height: 36px;
        border-radius: 0;
        color: rgba(#ffffff, 0.75);
        background: transparent;
        transition: all 0.2s ease;

        &.scale {
          font-size: 0.9rem;
          width: 50px;
          padding: 0;
          opacity: 0.6;
          cursor: default;
        }

        &.disabled {
          color: rgba(#ffffff, 0.2) !important;
          cursor: not-allowed !important;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff;
        }

        &:first-child {
          border-radius: 6px 0 0 6px;
        }

        &:last-child {
          border-radius: 0 6px 6px 0;
        }
      }
    }
  }
}
</style>

<template>
  <teleport to="body">
    <div v-if="show" class="dialog-overlay o-diagram-viewer">
      <header>
        <o-btn icon="close" @click="onClose" />
      </header>

      <div class="dialog-box">
        <div class="dialog-body">
          <div
            class="image-container"
            ref="imageContainerRef"
            @wheel.prevent="onWheel"
            @mousedown="onMouseDown"
            @dblclick="resetZoom"
          >
            <div
              ref="svgWrapperRef"
              class="mermaid-svg"
              :style="imageStyle"
              v-html="svg"
            />
          </div>
        </div>
      </div>

      <footer>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { OBtn } from '../index'
import { useCommon } from '../../hooks'

defineOptions({ name: 'ODiagramDialog' })

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  svg: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:show'])

const { commonDownload } = useCommon()
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const svgWrapperRef = ref<HTMLDivElement | null>(null)
const imageContainerRef = ref<HTMLDivElement | null>(null)

const ZOOM_CONFIG = {
  MIN_SCALE: 0.1,
  MAX_SCALE: 10,
  STEP: 0.1,
  WHEEL_SENSITIVITY: 0.001,
}

const imageStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
  transformOrigin: 'center center',
  cursor: isDragging.value ? 'grabbing' : scale.value > 1 ? 'grab' : 'default',
}))

const scalePercent = computed(() => {
  return parseInt(`${scale.value * 100}`)
})

const onWheel = (event: WheelEvent) => {
  event.preventDefault()

  const delta = -event.deltaY * ZOOM_CONFIG.WHEEL_SENSITIVITY
  let newScale = scale.value + delta
  newScale = Math.max(
    ZOOM_CONFIG.MIN_SCALE,
    Math.min(ZOOM_CONFIG.MAX_SCALE, newScale)
  )

  if (imageContainerRef.value && svgWrapperRef.value) {
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
    y: event.clientY - position.value.y,
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

const onClose = () => {
  resetZoom()
  emits('update:show', false)
}

const onDownload = () => {
  if (!props.svg) {
    return
  }
  const fileName = `mermaid-${Date.now()}.svg`
  commonDownload('svg', fileName, props.svg)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!props.show) return

  switch (event.key) {
    case '+':
    case '=':
      event.preventDefault()
      event.stopPropagation()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      event.stopPropagation()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      event.stopPropagation()
      resetZoom()
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      onClose()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style lang="scss">
.o-diagram-viewer {
  position: fixed;
  inset: 0;
  background: var(--yii-bg-color);
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

        .mermaid-svg {
          width: 75%;
          height: 75%;
          min-width: 480px;
          min-height: 480px;
          max-width: 90vw;
          max-height: 80vh;

          transition: transform 0.05s ease-out;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;

          /* Crucial: Override Mermaid inline styles to scale correctly */
          svg {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain;
          }
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
      background: rgba(0, 0, 0, 0.3);

      &:hover {
        color: #ffffff;
        background: rgba(0, 0, 0, 0.6) !important;
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

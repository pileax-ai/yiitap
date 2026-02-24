<template>
  <o-node-view
    ref="imageView"
    v-bind="props"
    class="o-image-view"
    :class="{
      max: isMax,
      'with-caption': attrs.alt,
      readonly: !editor?.isEditable,
      init: src === 'init',
    }"
    as="div"
    @contextmenu.prevent="onContextMenu"
    @click="onClick"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="src === 'init' ? 'bottom' : 'top'"
      show-arrow
    >
      <template #popover-content>
        <o-media-input
          :val="src === 'init' ? '' : src"
          type="image"
          @input="onInput"
        />
      </template>

      <o-block-placeholder
        icon="image"
        :placeholder="tr('label.imageAdd')"
        v-if="src === 'init'"
      />
      <div class="image-panel" v-else>
        <o-block-toolbar v-bind="props" @action="onAction">
          <template v-if="isEditable">
            <o-menubar-btn
              :icon="canDrag ? 'arrow_expand' : 'close'"
              :icon-class="canDrag ? 'rotate-315' : ''"
              content-class="with-label"
              :tooltip="tr('image.repositionTips')"
              @click.stop="onToggleDrag"
              v-if="showPositionControls"
            >
              <span class="label"> {{ tr('image.reposition') }} </span>
            </o-menubar-btn>
            <o-menubar-btn
              icon="subtitles"
              :tooltip="tr('image.caption')"
              @click.stop="onCaption"
            />
            <o-link-btn :editor="editor" />
            <o-align-dropdown :editor="editor" placement="bottom-end" />
          </template>

          <o-menubar-btn
            icon="download"
            :tooltip="tr('label.download')"
            @click="onDownload"
          />
          <o-menubar-btn
            icon="zoom_in"
            :tooltip="tr('image.zoom')"
            @click="onPreview"
          />
        </o-block-toolbar>
        <div
          ref="imageContainer"
          class="image-container"
          :style="containerStyle"
          @mousedown="onContainerMouseDown"
        >
          <!-- Image -->
          <div ref="imageWrapper" class="image-wrapper" :style="wrapperStyle">
            <img
              ref="imageElement"
              v-bind="attrs"
              draggable="true"
              data-drag-handle
              @load="onImageLoad"
            />
          </div>

          <template v-if="isEditable">
            <!-- Resizer -->
            <div
              class="block-resizer left"
              @mousedown.stop.prevent="onResizeStart($event, 'left')"
            >
              <div class="block-resizer-indicator"></div>
            </div>
            <div
              class="block-resizer right"
              @mousedown.stop.prevent="onResizeStart($event, 'right')"
            >
              <div class="block-resizer-indicator"></div>
            </div>
            <div
              class="block-resizer bottom"
              @mousedown.stop.prevent="onResizeStart($event, 'bottom')"
              v-if="isMax"
            >
              <div class="block-resizer-indicator"></div>
            </div>

            <!-- Overlay -->
            <div class="resize-overlay" v-if="isResizing">
              <div class="resize-guide">
                <div class="size-display">
                  {{ currentWidth }} × {{ currentContainerHeight }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Caption -->
        <div class="caption" @click="onCaption">
          <o-input
            ref="captionInput"
            class="caption-input"
            v-model="caption"
            type="text"
            placeholder="Input caption"
            autosize
            @blur="onCaptionInputBlur"
            v-if="editor?.isEditable && showCaptionInput"
          />
          <span v-else>{{ caption }}</span>
        </div>
      </div>
    </o-block-popover>

    <o-context-menu v-model="showContextMenu" :event="mouseEvent">
      <o-block-menu v-bind="props" @action="onAction" />
    </o-context-menu>

    <o-image-viewer
      v-model:show="showImageViewer"
      :images="images"
      :current="currentImageIndex"
    >
      <template #title>Run</template>
    </o-image-viewer>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { useCommon, useI18n, useTiptap } from '../../hooks'
import {
  OAlignDropdown,
  OBlockMenu,
  OBlockPlaceholder,
  OBlockPopover,
  OBlockToolbar,
  OContextMenu,
  OImageViewer,
  OInput,
  OLinkBtn,
  OMediaInput,
  OMenubarBtn,
  ONodeView,
} from '../../components/index'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { downloadImage } = useCommon()
const { isEditable, getEditorImages } = useTiptap()
const showContextMenu = ref(false)
const showPopover = ref(false)
const mouseEvent = ref({})
const captionInput = ref(null)
const showCaptionInput = ref(false)
const showImageViewer = ref(false)
const currentImageIndex = ref(0)
const images = ref<EditorImage[]>([])

// Resize
const imageView = ref<InstanceType<typeof ONodeView>>()
const imageContainer = ref<HTMLElement | null>(null)
const imageWrapper = ref<HTMLElement | null>(null)
const imageElement = ref<HTMLImageElement | null>(null)
const isResizing = ref(false)
const resizeDirection = ref('') // 'left', 'right', 'center'
const originalWidth = ref(0)
const originalHeight = ref(0)
const originalClientX = ref(0)
const originalClientY = ref(0)
const currentWidth = ref(props.node.attrs.width || 0)
const currentHeight = ref(props.node.attrs.height || 0)
const currentContainerHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const containerMaxWidth = ref(1200)
const containerMaxHeight = ref(0)
const containerHeight = ref(0)
const maxWidth = ref(800)
const maxHeight = ref(400)
const isMax = ref(false)

// Drag to move
const dragEnabled = ref(true)
const isDragging = ref(false)
const imagePositionY = ref(props.node.attrs.positionY || 0)
const dragStartY = ref(0)
const dragStartPositionY = ref(0)
const showPositionControls = ref(false)

const attrs = computed(() => {
  return props.node.attrs
})

const src = computed({
  get() {
    return props.node.attrs.src
  },
  set(value) {
    props.updateAttributes({ src: value })
  },
})

const caption = computed({
  get() {
    return props.node.attrs.title
  },
  set(value) {
    props.updateAttributes({ title: value })
  },
})

function onCaption() {
  showCaptionInput.value = true
  setTimeout(() => {
    captionInput.value?.focus()
  }, 0)
}

function onDownload() {
  downloadImage(props.node.attrs.src)
}

function onPreview() {
  images.value = getEditorImages(props.editor)
  currentImageIndex.value =
    images.value.findIndex((e) => e.pos === props.getPos()) || 0
  showImageViewer.value = true
}

function onCaptionInputBlur() {
  showCaptionInput.value = false
}

function onClick() {
  if (src.value === 'init') {
    onShowPopover(true)
  }
}

function onContextMenu(e: MouseEvent) {
  showContextMenu.value = true
  mouseEvent.value = e
}

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onShowPopover(true)
      break
  }
}

function onInput(value: string) {
  src.value = value
  onShowPopover(false)
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}

// ------------------------------------------------------------
// Resize
// ------------------------------------------------------------
// Styles
const containerStyle = computed(() => {
  return {
    width: `${currentWidth.value}px`,
    maxWidth: `${containerMaxWidth.value}px`,
    height: `${currentContainerHeight.value}px`,
    maxHeight: isMax.value ? `${containerMaxHeight.value}px` : 'auto',
    cursor: isResizing.value ? getResizeCursor() : 'default',
  }
})

function getResizeCursor() {
  switch (resizeDirection.value) {
    case 'left':
      return 'ew-resize'
    case 'right':
      return 'ew-resize'
    case 'bottom':
      return 'ew-resize'
    default:
      return 'default'
  }
}

// Init size when image loaded
function onImageLoad() {
  if (imageElement.value) {
    naturalWidth.value = imageElement.value.naturalWidth
    naturalHeight.value = imageElement.value.naturalHeight
    maxWidth.value =
      imageView.value?.$el?.parentElement.getBoundingClientRect().width ?? 0
    containerMaxWidth.value =
      document.querySelector('.layout')?.getBoundingClientRect().width ?? 1200
    // console.log('natural', naturalWidth.value, naturalHeight.value, maxWidth.value, containerMaxWidth.value)
    // console.log('container', currentContainerHeight.value, containerHeight.value, containerMaxHeight.value)

    // Set max width and height
    const aspectRatio = naturalWidth.value / naturalHeight.value
    maxWidth.value = Math.min(maxWidth.value, 800)
    maxHeight.value = maxWidth.value / aspectRatio

    // Use natural size if no size found
    if (!currentWidth.value || !currentHeight.value) {
      isMax.value = naturalWidth.value > maxWidth.value
      if (isMax.value) {
        currentWidth.value = maxWidth.value
        currentHeight.value =
          (maxWidth.value / naturalWidth.value) * naturalHeight.value
      } else {
        currentWidth.value = naturalWidth.value
        currentHeight.value = naturalHeight.value
      }
      updateImageSize()
    } else {
      isMax.value = currentWidth.value > maxWidth.value
    }
    // console.log('current', currentWidth.value, currentHeight.value, containerHeight.value)

    // container
    if (containerHeight.value > 0) {
      currentContainerHeight.value = containerHeight.value
    } else {
      currentContainerHeight.value = currentHeight.value
      containerHeight.value = currentHeight.value
    }

    containerMaxHeight.value = currentHeight.value
    // console.log('container', currentContainerHeight.value, containerHeight.value, containerMaxHeight.value)
    checkPositionControls()
  }
}

/**
 * Resize start
 * @param event Mouse event
 * @param direction Move direction
 * - left | right: change width and height
 * - bottom: change height only
 */
function onResizeStart(
  event: MouseEvent,
  direction: 'left' | 'right' | 'bottom'
) {
  isResizing.value = true
  resizeDirection.value = direction
  originalClientX.value = event.clientX
  originalClientY.value = event.clientY
  originalWidth.value = currentWidth.value
  originalHeight.value = currentHeight.value

  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!isResizing.value) return

  const deltaX = e.clientX - originalClientX.value
  const deltaY = e.clientY - originalClientY.value
  const aspectRatio = naturalWidth.value / naturalHeight.value

  let newWidth = originalWidth.value
  let conHeight = containerHeight.value

  switch (resizeDirection.value) {
    case 'left':
      // Left handle: Drag left to increase width, drag right to decrease width
      newWidth = originalWidth.value - deltaX
      break

    case 'right':
      // Right handle: Drag right to increase width, drag left to decrease width
      newWidth = originalWidth.value + deltaX
      break

    case 'bottom':
      // Bottom: Drag up to decrease debug height, drag down to increase debug height
      conHeight = containerHeight.value + deltaY
      break
  }

  // Calculate the height and preserve the aspect ratio
  const newHeight = newWidth / aspectRatio
  currentWidth.value = Math.round(newWidth)
  currentHeight.value = Math.round(newHeight)

  // Set container height
  isMax.value = newWidth > maxWidth.value
  if (isMax.value) {
    currentContainerHeight.value = conHeight
    containerMaxHeight.value = currentHeight.value
  } else {
    currentContainerHeight.value = currentHeight.value
    resetImagePosition()
  }
}

function onResizeEnd() {
  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)

  // Apply update
  containerHeight.value = currentContainerHeight.value
  updateImageSize()
}

function updateImageSize() {
  props.updateAttributes({
    width: currentWidth.value,
    height: currentHeight.value,
    containerHeight: containerHeight.value,
  })
}

// ------------------------------------------------------------
// Drag to move
// ------------------------------------------------------------
const minPositionY = computed(() => {
  if (!currentHeight.value || !currentContainerHeight.value) return 0
  return Math.min(0, currentContainerHeight.value - currentHeight.value)
})

const wrapperStyle = computed(() => {
  return {
    transform: `translateY(${imagePositionY.value}px)`,
    cursor: canDrag.value ? 'grab' : 'default',
    transition: isDragging.value ? 'none' : 'transform 0.2s ease',
  }
})

const canDrag = computed(() => {
  return (
    dragEnabled.value &&
    isMax.value &&
    currentContainerHeight.value < currentHeight.value
  )
})

function onToggleDrag() {
  dragEnabled.value = !dragEnabled.value
}

function checkPositionControls() {
  if (isMax.value && currentContainerHeight.value < currentHeight.value) {
    showPositionControls.value = true
  } else {
    showPositionControls.value = false
  }
}

function resetImagePosition() {
  if (imagePositionY.value !== 0) {
    imagePositionY.value = 0
    updateImagePosition()
  }
}

function onContainerMouseDown(event: MouseEvent) {
  if (!canDrag.value || !showPositionControls.value || isResizing.value) return

  const target = event.target as HTMLElement
  if (target.closest('.block-resizer')) return

  event.preventDefault()
  event.stopPropagation()

  isDragging.value = true
  dragStartY.value = event.clientY
  dragStartPositionY.value = imagePositionY.value

  document.addEventListener('mousemove', onContainerMouseMove)
  document.addEventListener('mouseup', onContainerMouseUp)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
}

function onContainerMouseMove(event: MouseEvent) {
  if (!isDragging.value) return

  const deltaY = event.clientY - dragStartY.value
  let newPosition = dragStartPositionY.value + deltaY

  newPosition = Math.max(minPositionY.value, Math.min(0, newPosition))
  imagePositionY.value = newPosition
}

function onContainerMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onContainerMouseMove)
  document.removeEventListener('mouseup', onContainerMouseUp)

  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  updateImagePosition()
}

function updateImagePosition() {
  props.updateAttributes({
    positionY: imagePositionY.value,
  })
}

watch(
  () => props.node.attrs.height,
  (newHeight) => {
    if (newHeight) {
      currentHeight.value = newHeight
    }
  }
)

watch(
  () => props.node.attrs.containerHeight,
  (newContainerHeight) => {
    if (newContainerHeight) {
      containerHeight.value = newContainerHeight
      currentContainerHeight.value = newContainerHeight
      checkPositionControls()
    }
  }
)

watch(
  () => props.node.attrs.positionY,
  (newPositionY) => {
    if (newPositionY !== undefined) {
      imagePositionY.value = newPositionY
    }
  }
)

onMounted(() => {
  onShowPopover(src.value === 'init')

  // Init size
  if (attrs.value.width) {
    currentWidth.value = attrs.value.width
  }
  if (attrs.value.height) {
    currentHeight.value = attrs.value.height
  }
  if (attrs.value.containerHeight) {
    containerHeight.value = attrs.value.containerHeight
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', () => {})
  document.removeEventListener('mouseup', () => {})
})
</script>

<style lang="scss">
.o-node-view:has(.o-image-view.max) {
  p {
    max-width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    .o-image-view {
      align-self: center;
    }
  }
}

.o-image-view {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: none !important;

  &.has-focus {
    background: rgba(172, 206, 247, 0.5) !important;
  }

  &:hover {
    .block-resizer {
      opacity: 1 !important;
    }
  }

  &.init {
    width: 100%;
  }

  .image-panel {
    flex-wrap: wrap;
    position: relative;
    display: inline-block;
    overflow: hidden;
    min-height: 40px;

    .caption {
      width: 100%;
      text-align: center;

      .caption-input {
        display: block;
        width: 100%;
        padding: 0;
        caret-color: transparent !important;
        outline: none;
        background: transparent !important;

        input {
          font-size: 0.8rem;
          color: var(--yii-caption-color);
          height: unset;
          padding: 0;
        }
      }

      span {
        font-size: 0.8rem;
        color: var(--yii-caption-color);
      }
    }

    .o-block-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      z-index: 1;
    }
  }

  .image-container {
    flex-wrap: wrap;
    position: relative;
    display: inline-block;
    overflow: hidden;
    min-width: 100px;
    min-height: 100px;

    .image-wrapper {
      img {
        width: 100%;
        height: 100%;
        transition: all 0.2s ease;
        border-radius: 3px;
        object-fit: cover;
        display: block;
        user-select: none;
      }
    }

    .block-resizer {
      position: absolute;
      top: 0;
      height: 100%;
      width: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: col-resize;
      z-index: 10;
      display: flex;
      align-items: center;

      &.left {
        left: 8px;
      }

      &.right {
        right: 8px;
      }

      &-indicator {
        width: 4px;
        height: 48px;
        background-color: var(--yii-tips-color);
        border-radius: 2px;
      }

      &.bottom {
        top: unset;
        bottom: 8px;
        width: 100%;
        height: 4px;
        justify-content: center;
        cursor: row-resize;

        .block-resizer-indicator {
          width: 48px;
          height: 4px;
        }
      }
    }

    .resize-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;

      .resize-guide {
        position: relative;
        width: 100%;
        height: 100%;

        .size-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--yii-bg-color);
          color: var(--yii-color);
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

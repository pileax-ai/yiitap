<template>
  <o-node-view
    v-bind="props"
    class="o-model-viewer-view"
    :class="{
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
    >
      <template #popover-content>
        <o-media-input
          :val="src === 'init' ? '' : src"
          type="video"
          @input="onInput"
        />
      </template>

      <o-block-placeholder
        icon="3d_rotation"
        :placeholder="tr('label.model3dAdd')"
        v-if="src === 'init'"
      />
      <div class="model-viewer-container" v-else>
        <o-block-toolbar v-bind="props" @action="onAction">
          <template v-if="isEditable">
            <o-menubar-btn
              icon="subtitles"
              :tooltip="tr('label.caption')"
              @click="onCaption"
            />
          </template>

          <o-menubar-btn
            icon="zoom_in"
            :tooltip="tr('image.zoom')"
            @click="onPreview"
          />
        </o-block-toolbar>

        <model-viewer
          v-bind="node.attrs"
          ar
          ar-modes="webxr scene-viewer quick-look"
          seamless-poster
          shadow-intensity="1"
          camera-controls
          enable-pan
        >
        </model-viewer>

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

    <o-dialog
      v-model:show="dialogOptions.show"
      v-bind="dialogOptions"
      :title="tr('label.model3d')"
      dialog-class="model-viewer-dialog"
    >
      <div class="model-viewer-container">
        <model-viewer
          v-bind="node.attrs"
          ar
          ar-modes="webxr scene-viewer quick-look"
          seamless-poster
          shadow-intensity="1"
          camera-controls
          enable-pan
        >
        </model-viewer>
      </div>
    </o-dialog>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { useI18n, useTiptap } from '../../hooks'
import {
  OBlockMenu,
  OBlockPlaceholder,
  OBlockPopover,
  OBlockToolbar,
  OContextMenu,
  ODialog,
  OInput,
  OMediaInput,
  OMenubarBtn,
  ONodeView,
} from '../../components/index'
import type { DialogOption } from '../../types/types'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { isEditable } = useTiptap()
const showContextMenu = ref(false)
const mouseEvent = ref({})
const captionInput = ref(null)
const showCaptionInput = ref(false)
const showPopover = ref(false)

const dialogOptions = ref<DialogOption>({
  show: false,
  fullscreen: true,
})

const caption = computed({
  get() {
    return props.node.attrs.caption
  },
  set(value) {
    props.updateAttributes({ caption: value })
  },
})

const src = computed({
  get() {
    return props.node.attrs.src
  },
  set(value) {
    props.updateAttributes({ src: value })
  },
})

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onShowPopover(true)
      break
  }
}

function onCaption() {
  showCaptionInput.value = true
  setTimeout(() => {
    captionInput.value?.focus()
  }, 0)
}

function onCaptionInputBlur() {
  showCaptionInput.value = false
}

function onPreview() {
  dialogOptions.value.show = true
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

function onInput(value: string) {
  src.value = value
  onShowPopover(false)
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}

onMounted(() => {
  onShowPopover(src.value === 'init')
})
</script>

<style lang="scss">
.o-model-viewer-view {
  position: relative;
  display: block;
  cursor: pointer;
  width: 100%;
  margin: 6px 0;

  .model-viewer-container {
    position: relative;
    overflow: hidden;
    min-height: 40px;

    .o-block-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      z-index: 1;
    }

    model-viewer {
      display: block;
      width: 100%;
      height: 400px;
      border-radius: 3px;
      object-fit: cover;
      vertical-align: middle;
    }

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
  }
}

.model-viewer-dialog {
  .model-viewer-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    model-viewer {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 3px;
      object-fit: cover;
      vertical-align: middle;
    }
  }
}
</style>

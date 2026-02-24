<template>
  <o-node-view
    v-bind="props"
    class="o-audio-view"
    :class="{
      readonly: !editor?.isEditable,
      init: src === INIT_SRC,
    }"
    as="div"
    @contextmenu.prevent="onContextMenu"
    @click="onClick"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="src === INIT_SRC ? 'bottom' : 'top'"
    >
      <template #popover-content>
        <o-media-input
          :val="src === INIT_SRC ? '' : src"
          type="audio"
          @input="onInput"
        />
      </template>

      <o-block-placeholder
        icon="graphic_eq"
        :placeholder="tr('label.audioAdd')"
        v-if="src === INIT_SRC"
      />
      <div class="audio-container" v-else>
        <o-block-toolbar v-bind="props" @action="onAction" v-if="isEditable">
          <o-menubar-btn
            icon="subtitles"
            :tooltip="tr('image.caption')"
            @click="onCaption"
            v-if="false"
          />
        </o-block-toolbar>
        <audio v-bind="node.attrs" draggable="true" data-drag-handle controls>
          <source v-bind="node.attrs" />
        </audio>
      </div>
    </o-block-popover>

    <o-context-menu v-model="showContextMenu" :event="mouseEvent">
      <o-block-menu v-bind="props" @action="onAction" />
    </o-context-menu>
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
  OInput,
  OMediaInput,
  OMenubarBtn,
  ONodeView,
} from '../../components/index'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { isEditable } = useTiptap()
const showContextMenu = ref(false)
const mouseEvent = ref({})
const captionInput = ref(null)
const showCaptionInput = ref(false)
const showPopover = ref(false)
const INIT_SRC = '//init.mp3'

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

function onClick() {
  if (src.value === INIT_SRC) {
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
  onShowPopover(src.value === INIT_SRC)
})
</script>

<style lang="scss">
.o-audio-view {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 100%;
  margin: 3px 0;

  .audio-container {
    position: relative;
    overflow: hidden;
    min-height: 40px;
    //background: red;

    .o-block-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      z-index: 1;
    }

    audio {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      margin-top: 10px;
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
</style>

<template>
  <section class="o-add-node-view">
    <section class="view-main" v-if="view === 'main'">
      <section>
        <div class="group o-tips">{{ tr('label.basic') }}</div>
        <section class="panel">
          <o-menubar-btn
            v-for="(item, index) in BasicBlocks"
            :key="index"
            :icon="item.icon"
            :tooltip="tr(item.label)"
            quaternary
            @click="onClick(item)"
          />
        </section>
      </section>
      <o-divider />
      <o-list hoverable clickable>
        <template v-if="CommonBlocks.length">
          <template v-for="(item, index) in CommonBlocks" :key="index">
            <template v-if="item.group">
              <o-divider v-if="index > 0" />
              <div class="group o-tips">{{ tr(item.group) }}</div>
            </template>
            <o-list-item class="item" clickable @click="onClick(item)">
              <template #prefix>
                <o-icon :name="item.icon" :color="item.color" />
              </template>

              {{ tr(item.label) }}
            </o-list-item>
          </template>
        </template>
        <div class="item" v-else>No result</div>
      </o-list>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import {
  ODivider,
  OIcon,
  OList,
  OListItem,
  OMenubarBtn,
} from '../../../components/index'
import { BasicBlocks, CommonBlocks } from '../../../constants/block'
import {
  EmptyAiBlock,
  EmptyAudio,
  EmptyBlockquote,
  EmptyCallout,
  EmptyCodeblock,
  EmptyDetails,
  EmptyDiagram,
  EmptyEmoji,
  EmptyImage,
  EmptyListItem,
  EmptyParagraph,
  EmptyTable,
  EmptyTaskItem,
  EmptyVideo,
} from '../../../constants/empty-block'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])
const { locale, tr } = useI18n()
const { run } = useTiptap()
const view = ref('main')

function onClick(item) {
  let content = null
  switch (item.value) {
    case 'aiBlock':
      content = EmptyAiBlock
      break
    case 'audio':
      content = EmptyAudio
      break
    case 'blockquote':
      content = EmptyBlockquote
      break
    case 'callout':
      content = EmptyCallout
      break
    case 'codeBlock':
      content = EmptyCodeblock
      break
    case 'details':
      content = EmptyDetails
      break
    case 'diagram':
      content = EmptyDiagram
      break
    case 'emoji':
      content = EmptyEmoji
      break
    case 'heading':
      content = {
        attrs: item.options,
      }
      break
    case 'horizontalRule':
      content = {}
      break
    case 'paragraph':
      content = {
        type: 'paragraph',
        content: [],
      }
      break
    case 'bulletList':
    case 'orderedList':
      content = {
        content: EmptyListItem,
      }
      break
    case 'taskList':
      content = {
        content: EmptyTaskItem,
      }
      break
    case 'table':
      content = EmptyTable
      break
    case 'image':
      content = EmptyImage
      break
    case 'model-viewer':
      content = { attrs: { src: 'init' } }
      break
    case 'video':
      content = EmptyVideo
      break
    default:
      break
  }

  // Add new node
  if (content) {
    content.type = content.type || item.value
    const insertPos = isEmpty.value ? newPos.value + 1 : newPos.value
    const focusPosition = item.value === 'emoji' ? insertPos + 2 : insertPos + 1

    requestAnimationFrame(() => {
      props.editor
        .chain()
        .insertContentAt(insertPos, content)
        .focus(focusPosition)
        .scrollIntoView()
        .run()
    })
  }
  emit('action', item)
}

const isEmpty = computed(() => {
  return props.node?.content.size === 0
})

const newPos = computed(() => {
  // console.log('node', props.getPos(), props.node)
  return isEmpty.value ? props.getPos() : props.getPos() + props.node.nodeSize
})

const getNewPos = () => {
  return isEmpty.value ? props.getPos() : props.getPos() + props.node.nodeSize
}
</script>

<style lang="scss">
.o-add-node-view {
  border-radius: 4px;
  width: 232px;
  font-size: 0.9rem;

  .panel {
    padding: 0 8px;
    .o-tooltip {
      display: inline-block;
      width: 36px;
      height: 36px;
      padding: 0;

      .o-menubar-btn {
        width: 36px;
        height: 36px;
      }
    }
  }

  .group {
    font-size: 12px;
    padding: 4px 10px;
  }

  .items {
    padding: 0 8px !important;
    margin: 0;
  }
  .item {
    min-height: 40px !important;
    text-align: left;
    background: transparent;
    border-radius: 3px;
    padding: 4px 8px;
    text-transform: unset;

    &.is-selected {
      border-color: #000;
    }
  }
}
</style>

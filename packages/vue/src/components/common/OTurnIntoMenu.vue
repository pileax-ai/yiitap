<template>
  <section>
    <div class="group o-tips" v-if="showGroup">
      {{ nodeLabel }}
    </div>
    <o-popover ref="popover" :offset="[0, 4]" placement="right">
      <template #trigger>
        <o-list-item class="item" clickable>
          <template #prefix>
            <o-icon name="repeat" />
          </template>
          <template #suffix>
            <o-icon name="navigate_next" class="o-tips" />
          </template>

          {{ tr('label.turnInto') }}
        </o-list-item>
      </template>

      <o-list hoverable clickable style="min-width: 200px">
        <template v-for="(item, index) in AllStyleBlocks" :key="index">
          <template v-if="item.group || item.subGroup">
            <div class="group o-tips">
              <template v-if="item.group">{{ tr(item.group) }}</template>
              <template v-if="item.subGroup">{{ tr(item.subGroup) }}</template>
            </div>
          </template>
          <o-list-item
            class="item"
            :class="{ 'is-active': isActive(item) }"
            clickable
            @click="onAction(item)"
          >
            <template #prefix>
              <o-icon :name="item.icon" :color="item.color" />
            </template>

            {{ tr(item.label) }}
          </o-list-item>
        </template>
      </o-list>
    </o-popover>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { OIcon, OList, OListItem, OPopover } from '../../components/index'
import { AllStyleBlocks } from '../../constants/block'
import { nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  ...nodeViewProps,
  colorful: {
    type: Boolean,
    default: false,
  },
  showGroup: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['action'])

const { tr } = useI18n()
const { inferNodeType } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()

const nodeType = computed(() => {
  return inferNodeType(props.node)
})

const nodeLabel = computed(() => {
  if (nodeType.value === 'toggleHead') {
    const head = props.node?.content?.content[0]
    const level = head.attrs.level
    if (level === 0) {
      return tr('editor.toggleList')
    }
  }

  return tr(`editor.${nodeType.value}`)
})

function isActive(item: Indexable) {
  return (
    item.value === nodeType.value &&
    props.editor?.isActive(nodeType.value, item.options)
  )
}

function onAction(item: Indexable) {
  emit('action', { ...item, value: item.turnIntoValue || item.value })
  popover.value?.setShow(false)
}
</script>

<style lang="scss">
.o-turn-into-menu {
  padding-inline-start: 0 !important;
  margin-block-start: 0 !important;
  margin-block-end: 0 !important;

  .o-list-item__suffix {
    display: flex;
  }

  .item {
    .suffix {
      display: flex;
      flex-wrap: nowrap;
      font-size: 10px;
    }
  }
}
</style>

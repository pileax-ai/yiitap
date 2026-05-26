<template>
  <section class="o-emoji-select">
    <div class="search" v-if="enableSearch">
      <o-input
        ref="input"
        v-model="value"
        type="text"
        autofocus
        clearable
        @update:modelValue="onSearch"
      >
        <template #prefix>
          <o-icon name="search" class="o-tips" />
        </template>
      </o-input>
    </div>

    <section ref="scrollContainer" class="groups o-scroll" @scroll="onScroll">
      <template v-for="(group, i) in visibleGroups" :key="`group-${i}`">
        <div
          :ref="(el) => setGroupRef(el, i)"
          class="group"
          v-show="group.emojis?.length"
        >
          <header>{{ group.name }}</header>
          <section class="items">
            <div v-for="(item, j) in group.emojis" :key="`item-${j}`">
              <div class="item" @click="onSelected(item)">
                {{ item.emoji }}
              </div>
            </div>
          </section>
        </div>
      </template>

      <div class="groups-empty" v-if="!isNotEmpty">没有记录</div>
    </section>

    <section class="group-icons">
      <template v-for="(group, i) in visibleGroups" :key="`target-${i}`">
        <o-tooltip :delay="300" placement="bottom">
          <template #trigger>
            <div
              class="item"
              :class="{ active: groupIndex === i }"
              @click="onScrollTo(group, i)"
              v-show="group.emojis?.length"
            >
              <o-icon :name="emojiGroupIcons[group.slug]" />
            </div>
          </template>
          {{ group.name }}
        </o-tooltip>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { filterEmojiGroups, emojiGroupIcons } from '@yiitap/util-emoji'
import { OIcon, OInput, OTooltip } from '../../components'

const props = defineProps({
  items: {
    type: Array as () => Indexable[],
    required: true,
  },
  enableSearch: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['select'])

const input = ref(null)
const value = ref('')
const searchResults = ref([])
const groupIndex = ref(0)

const scrollContainer = ref<HTMLElement | null>(null)
const groupRefs = ref<Record<number, HTMLElement>>({})
let isClickScrolling = false
let observer: IntersectionObserver | null = null

const visibleGroups = computed(() => {
  return value.value ? searchResults.value : props.items
})

const isNotEmpty = computed(() => {
  let notEmpty = false
  visibleGroups.value.map((item) => {
    notEmpty = notEmpty || item.emojis.length
  })
  return notEmpty
})

function setGroupRef(el: any, index: number) {
  if (el) {
    groupRefs.value[index] = el
  }
}

function onSearch() {
  groupIndex.value = 0
  searchResults.value = value.value ? filterEmojiGroups(value.value) : []

  // Re-init observer after search results change and DOM updates
  nextTick(() => {
    initObserver()
  })
}

function onSelected(item: Indexable) {
  emit('select', item)
}

function onScroll() {
  if (isClickScrolling) {
    // If it's a click-triggered scroll, we let scrollIntoView finish
    // A simple timeout or intersection observer logic below will handle resetting
  }
}

function onScrollTo(item: Indexable, index: number) {
  groupIndex.value = index
  const target = groupRefs.value[index]
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
}

function initObserver() {
  if (observer) {
    observer.disconnect()
  }

  if (!scrollContainer.value) return

  // Set up the intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      // If we are currently executing a click-scroll, ignore observer updates
      if (isClickScrolling) {
        // Reset the lock once the target elements stabilize
        const isTargetIntersecting = entries.some(
          (entry) =>
            entry.isIntersecting &&
            groupRefs.value[groupIndex.value] === entry.target
        )
        if (isTargetIntersecting) {
          isClickScrolling = false
        }
        return
      }

      // Find the group that is most visible at the top of the container
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Find the index of the intersecting element
          const indexStr = Object.keys(groupRefs.value).find(
            (key) => groupRefs.value[Number(key)] === entry.target
          )
          if (indexStr !== undefined) {
            groupIndex.value = Number(indexStr)
            break
          }
        }
      }
    },
    {
      root: scrollContainer.value,
      // Trigger when the header is within the top portion of the view
      rootMargin: '0px 0px -50% 0px',
      threshold: 0,
    }
  )

  // Observe all group
  Object.values(groupRefs.value).forEach((groupEl) => {
    observer?.observe(groupEl)
  })
}

watch(
  visibleGroups,
  () => {
    groupRefs.value = {}
    nextTick(() => {
      initObserver()
    })
  },
  { deep: true }
)

onMounted(() => {
  // console.log('emojiGroup', emojiGroups)
  // console.log('emojiList', emojiList.value)
  initObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss">
.o-emoji-select {
  position: relative;
  width: 400px;

  .search {
    padding: 8px 8px 0 8px;
  }

  .groups {
    max-height: 344px !important;
    scrollbar-width: none;
    padding: 8px 8px 0 8px;
  }

  .groups-empty {
    padding: 16px 0;
    text-align: center;
    color: var(--yii-caption-color) !important;
  }

  .group {
    header {
      color: var(--yii-caption-color) !important;
    }
  }

  .group-empty {
    display: none;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    font-size: 26px;
    line-height: 1;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;

    &:hover,
    &.active {
      background: var(--yii-hover-bg-color) !important;
    }
  }

  .group-icons {
    display: flex;
    align-items: center;
    padding: 8px;
    border-top: solid 1px var(--yii-border-color);

    .item {
      margin-right: 4px;
    }

    .o-icon {
      font-size: 24px;
      color: var(--yii-tips-color) !important;
    }
  }
}
</style>

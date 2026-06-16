<template>
  <section class="o-emoji-select">
    <div class="search" v-if="enableSearch">
      <o-input
        ref="input"
        v-model="value"
        type="text"
        :placeholder="tr('label.search')"
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
          <header>{{ tr(`emojiGroup.${group.slug?.split('_')[0]}`) }}</header>
          <section class="items">
            <div v-for="(item, j) in group.emojis" :key="`item-${j}`">
              <div class="item" @click="onSelected(item)">
                {{ item.emoji }}
              </div>
            </div>
          </section>
        </div>
      </template>

      <div class="groups-empty" v-if="!isNotEmpty">
        {{ tr('label.noResults') }}
      </div>
    </section>

    <section class="group-icons" v-if="isNotEmpty">
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
          {{ tr(`emojiGroup.${group.slug?.split('_')[0]}`) }}
        </o-tooltip>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { filterEmojiGroups, emojiGroupIcons } from '@yiitap/util-emoji'
import { OIcon, OInput, OTooltip } from '../../components'
import { useI18n } from '../../hooks'

const props = defineProps({
  items: {
    type: Array as () => Indexable[],
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
  enableSearch: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['select'])

const { tr } = useI18n()
const input = ref(null)
const value = ref('')
const searchResults = ref([])
const recentEmojis = ref<Indexable[]>([])
const groupIndex = ref(0)

const scrollContainer = ref<HTMLElement | null>(null)
const groupRefs = ref<Record<number, HTMLElement>>({})
let isClickScrolling = false
let observer: IntersectionObserver | null = null
const RECENT_MAX_LIMIT = 24
const LOCAL_STORAGE_KEY = 'yiitap.emojis'

const combinedGroups = computed(() => {
  if (recentEmojis.value.length === 0 || props.query) {
    return props.items
  }

  const recentGroup = {
    name: 'Recent',
    slug: 'recent',
    emojis: recentEmojis.value,
  }

  return [recentGroup, ...props.items]
})

const visibleGroups = computed(() => {
  return value.value ? searchResults.value : combinedGroups.value
})

const isNotEmpty = computed(() => {
  let notEmpty = false
  visibleGroups.value.map((item) => {
    notEmpty = notEmpty || item.emojis.length
  })
  return notEmpty
})

function loadRecentEmojis() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    recentEmojis.value = data ? JSON.parse(data) : []
  } catch (e) {
    recentEmojis.value = []
  }
}

function saveToRecent(item: Indexable) {
  // Remove duplicate if it already exists
  const filtered = recentEmojis.value.filter((e) => e.emoji !== item.emoji)
  // Unshift to the front
  filtered.unshift(item)
  // Slice to limit size
  if (filtered.length > RECENT_MAX_LIMIT) {
    filtered.splice(RECENT_MAX_LIMIT)
  }
  recentEmojis.value = filtered
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
}

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
  saveToRecent(item)
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
  loadRecentEmojis()
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
    padding: 8px;
  }

  .groups-empty {
    padding: 16px 0;
    text-align: center;
    color: var(--yii-tips-color) !important;
  }

  .group {
    header {
      color: var(--yii-tips-color) !important;
      margin: 8px 0;
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
    font-size: 24px;
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

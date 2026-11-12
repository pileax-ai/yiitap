<template>
  <section class="o-find-menu-wrapper">
    <o-popover
      ref="popover"
      placement="left"
      size="medium"
      trigger="manual"
      class="o-encrypted-block-toolbar"
      tippy-class="o-encrypted-block-toolbar-popover"
      :offset="[0, 46]"
      :show-arrow="false">
      <template #trigger>
        <div></div>
      </template>

      <section class="o-find-menu" v-if="editor">
        <!-- Left -->
        <section class="left">
          <o-command-btn icon="navigate_next"
                         :icon-class="{ 'rotate-90': replaceEnabled }"
                         tooltip="Toggle Replace"
                         @click="toggleReplace"/>
        </section>

        <!-- Right -->
        <section class="right">
          <div class="search-item">
            <o-input
              ref="searchInput"
              placeholder="Search"
              v-model="findAndReplace.searchTerm"
              @update:modelValue="setSearchTerm"
              @keydown.enter.exact="editor.commands.goToNextResult()"
              @keydown.shift.enter="editor.commands.goToPreviousResult()"
              data-testid="search-input"
              tabindex="1"
              clearable
            >
              <template #suffix>
                <div class="rules">
                  <o-command-btn icon="match_case"
                                 tooltip="Match Case"
                                 :content-class="{ 'active': caseSensitive }"
                                 @click="toggleCaseSensitive" />
                  <o-command-btn icon="match_word"
                                 tooltip="Match Whole World"
                                 :content-class="{ 'active': wholeWord }"
                                 @click="toggleWholeWord" />
                  <o-command-btn icon="regular_expression"
                                 tooltip="Use Regular Expression"
                                 :content-class="{ 'active': useRegex }"
                                 @click="toggleUseRegex" />
                </div>
              </template>
            </o-input>
            <div class="result">{{ resultCount }}</div>
            <o-command-btn icon="arrow_back" icon-class="rotate-90"
                           :tooltip="`Previous Match (${convertShortcut('shift+Enter', true)})`"
                           :disabled="findAndReplace.results.length === 0"
                           @click="editor.commands.goToPreviousResult()" />
            <o-command-btn icon="arrow_back" icon-class="rotate-270"
                           :tooltip="`Next Match (Enter)`"
                           :disabled="findAndReplace.results.length === 0"
                           @click="editor.commands.goToNextResult()" />
            <o-command-btn icon="close" icon-class="rotate-270"
                           :tooltip="`${tr('label.close')} (ESC)`"
                           @click="showMenu(false)" />
          </div>
          <div class="replace-item" v-if="replaceEnabled">
            <o-input
              ref="replaceInput"
              placeholder="Replace"
              aria-label="Replace"
              v-model="findAndReplace.replaceTerm"
              @update:modelValue="setReplaceTerm"
              @keydown.enter.exact="editor.commands.replace()"
              @keydown.meta.enter="editor.commands.replaceAll()"
              data-testid="replace-input"
              tabindex="2"
              clearable
            />
            <o-command-btn icon="arrow_back" icon-class="rotate-90"
                           :disabled="findAndReplace.results.length === 0"
                           :tooltip="`Replace (Enter)`"
                           @click="editor?.commands.replace" />
            <o-command-btn icon="arrow_back" icon-class="rotate-270"
                           :disabled="findAndReplace.results.length === 0"
                           :tooltip="`Replace All (${convertShortcut('meta+Enter', true)})`"
                           @click="editor?.commands.replaceAll" />
          </div>
        </section>
      </section>
    </o-popover>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref} from 'vue'
import { Editor } from '@tiptap/core'
import type { FindAndReplaceStorage } from '@tiptap/extension-find-and-replace'

import { OCommandBtn, OInput, OPopover } from '../index'
import { useI18n } from '../../hooks'
import { convertShortcut } from '../../utils'

const props = defineProps({
  editor: {
    type: Editor,
    required: true
  },
})
const { tr } = useI18n()
const popover = ref<InstanceType<typeof OPopover>>()
const searchInput = ref<InstanceType<typeof OInput>>()
const replaceInput = ref<InstanceType<typeof OInput>>()

const replaceEnabled = ref(false)
const caseSensitive = ref(false)
const wholeWord = ref(false)
const useRegex = ref(false)
const findAndReplace = ref<FindAndReplaceStorage>(createFindAndReplaceState())

const resultCount = computed(() => {
  const { results, currentIndex } = findAndReplace.value

  return results.length === 0 ? 'No results' : `${(currentIndex ?? 0) + 1} / ${results.length}`
})

function createFindAndReplaceState(): FindAndReplaceStorage {
  return {
    searchTerm: '',
    replaceTerm: '',
    caseSensitive: false,
    useRegex: false,
    wholeWord: false,
    results: [],
    currentIndex: null,
  }
}

function updateFindAndReplace() {
  findAndReplace.value = { ...props.editor.storage.findAndReplace }
}

function toggleReplace() {
  replaceEnabled.value = !replaceEnabled.value
  if (replaceEnabled.value) {
    setTimeout(() => {
      replaceInput.value?.focus()
    }, 0)
  } else {
    searchInput.value?.focus()
  }
}

function toggleCaseSensitive() {
  caseSensitive.value = !caseSensitive.value
  props.editor.commands.setCaseSensitive(caseSensitive.value)
}

function toggleWholeWord() {
  wholeWord.value = !wholeWord.value
  props.editor.commands.setWholeWord(wholeWord.value)
}

function toggleUseRegex() {
  useRegex.value = !useRegex.value
  props.editor.commands.setUseRegex(useRegex.value)
}

function setSearchTerm(term: string) {
  findAndReplace.value.searchTerm = term
  props.editor.commands.setSearchTerm(term)
}

function setReplaceTerm(term: string) {
  props.editor.commands.setReplaceTerm(term)
}

function showMenu(value: boolean) {
  popover.value?.setShow(value)
  if (value) {
    searchInput.value?.focus()
  } else {
    props.editor.commands.clearSearch()
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  const isCmdOrCtrl = e.metaKey || e.ctrlKey

  if (isCmdOrCtrl && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    e.stopPropagation()
    showMenu(true)
  }

  if (e.key.toLowerCase() === 'escape') {
    e.stopPropagation()
    showMenu(false)
  }
}

onMounted(() => {
  props.editor.on('transaction', updateFindAndReplace)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeMount(() => {
  props.editor.off('transaction', updateFindAndReplace)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style lang="scss">
.o-find-menu-wrapper {
  position: absolute;
  top: 36px;
  right: 20px;

}
.o-find-menu {
  border-radius: 8px;
  background: var(--yii-tippy-popover-bg-color);
  z-index: 1;
  display: flex;
  align-items: stretch;

  .left {
    display: flex;
    align-items: stretch;

    .o-btn {
      padding: 0;
      margin-right: 8px;
      width: 24px;
      height: 100%;
    }
  }

  .right {
    .search-item, .replace-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .replace-item {
      margin-top: 6px;
    }

    .o-input {
      width: 280px;
      height: 32px;

      &-native {
        padding: 0 4px;
        background: var(--yii-active-bg-color);
        &__prefix {
          margin: 0;
        }
      }
    }

    .rules {
      display: inline-flex;
      gap: 2px;
    }

    .result {
      padding: 0 4px;
      min-width: 60px;
    }

    .o-btn {
      padding: 0;
      width: 20px;
      height: 20px;

      &.active {
        color: #ffffff;
        background: var(--yii-brand-blue) !important;
      }
    }
  }

  .o-divider {
    height: 24px;
  }
}
</style>

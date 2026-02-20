<template>
  <section class="page-simple-editor" :class="{ dark: darkMode }">
    <n-drawer
      v-model:show="showDrawer"
      :default-width="400"
      placement="right"
      resizable
    >
      <n-drawer-content title="Yii Editor" closable>
        <n-form ref="form" label-placement="left" label-width="auto">
          <h3>General</h3>
          <n-divider />
          <n-form-item label="Language">
            <n-select v-model:value="locale" :options="SupportLanguages" />
          </n-form-item>
          <n-form-item label="Mode">
            <n-switch v-model:value="darkMode" @update:value="onMode">
              <template #checked> Dark </template>
              <template #unchecked> Light </template>
            </n-switch>
          </n-form-item>
          <n-form-item label="Edit">
            <n-switch v-model:value="editable">
              <template #checked> Editable </template>
              <template #unchecked> Readonly </template>
            </n-switch>
          </n-form-item>

          <n-form-item label="Content">
            <n-select v-model:value="source" :options="sourceList" />
          </n-form-item>

          <h3>AI</h3>
          <n-divider />
          <n-form-item label="AI Provider">
            <n-select
              v-model:value="aiOption.provider"
              :options="aiProviders"
            />
          </n-form-item>
          <n-form-item label="Base URL" v-if="aiOption.provider === 'custom'">
            <n-input v-model:value="aiOption.baseURL" placeholder="baseURL" />
          </n-form-item>
          <n-form-item label="API Key">
            <n-input v-model:value="aiOption.apiKey" placeholder="apiKey" />
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>

    <section class="toolbar-container">
      <header>
        <section class="info">
          <div class="logo">
            <a href="https://yiitap.pileax.ai" target="_blank">
              <img src="/logo.png" alt="Logo" />
            </a>
          </div>
          <div class="title">Yiitap</div>
          <div class="version">
            <version-badge package="@yiitap/vue" />
          </div>
        </section>
        <section class="actions">
          <n-button quaternary @click="onGithub">
            <o-icon name="github" />
          </n-button>
          <n-button quaternary @click="onToggleDrawer">
            <o-icon name="settings" />
          </n-button>
        </section>
      </header>
    </section>
    <section class="content-container">
      <section class="layout page">
        <div class="layout-content">
          <editor-content :editor="editor" />
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, provide, ref, onMounted, watch, shallowRef } from 'vue'
import {
  NButton,
  NDivider,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSwitch,
} from 'naive-ui'

import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import { OIcon } from '@yiitap/vue'
import { SupportLanguages } from '@yiitap/i18n'
import { getData } from '@/data'
import VersionBadge from './VersionBadge.vue'

const emit = defineEmits(['mode'])

const locale = ref('en-US')
const darkMode = ref(false)
const editable = ref(true)
const source = ref('default')
const aiOption = ref<AiOption>({
  provider: 'deepseek',
  apiKey: '',
})
const showDrawer = ref(false)
provide('locale', locale)

// Collaboration
const editor = ref<Editor>()


const content = computed(() => {
  return getData(source.value, locale.value as 'en')
})

const sourceList = computed(() => {
  return [
    { label: 'Default', value: 'default' },
    { label: 'Empty', value: 'empty' },
    { label: 'Diagram', value: 'diagram' },
    { label: 'Image', value: 'image' },
    { label: 'Table', value: 'table' },
  ]
})

const aiProviders = computed(() => {
  return [
    {
      label: 'OpenAI',
      value: 'openai',
      baseURL: '',
    },
    {
      label: 'DeepSeek',
      value: 'deepseek',
      baseURL: 'https://api.deepseek.com/v1',
    },
    {
      label: 'Custom',
      value: 'custom',
      baseURL: '',
    },
  ]
})


function init() {
  try {
    locale.value = localStorage.getItem('yiitap.locale') || 'en-US'
    source.value = localStorage.getItem('yiitap.source') || 'default'
    const aiOptionString = localStorage.getItem('yiitap.ai.option')
    if (aiOptionString) {
      aiOption.value = JSON.parse(aiOptionString)
    }

    editor.value = new Editor({
      extensions: [StarterKit],
      content: 'Demo'
    })
  } catch (e) {
    // ignore
  }
}


function onToggleDrawer() {
  showDrawer.value = !showDrawer.value
}

function onGithub() {
  window.open('https://github.com/pileax-ai/yiitap', '_blank')
}

function onMode() {
  emit('mode', darkMode.value)
}

function onUpdate({ editor }: { editor: Editor }) {
  // Get content of editor
  // console.log(editor.getJSON())

  // markdown
  // const markdown = editor.markdown?.serialize(editor.getJSON())
  // console.log(markdown)

  if (import.meta.env.DEV) {
    console.log(editor.getHTML())
  }
}

function onDocScroll(event: Event) {
  // If docScroll event not emitted, use tocRef.value?.onScroll(event) to update toc progress when scrolling.
  // console.debug('docScroll', event)
}

watch(locale, (newValue) => {
  localStorage.setItem('yiitap.locale', newValue)
})

watch(source, (newValue) => {
  localStorage.setItem('yiitap.source', newValue)
})

watch(
  aiOption,
  (newValue) => {
    localStorage.setItem('yiitap.ai.option', JSON.stringify(aiOption.value))
  },
  { deep: true }
)

watch(editor, (newValue) => {
  // Access properties exposed by YiiEditor
  // console.debug('editor', yiiEditor.value?.editor)
  // console.debug(
  //   'extensions',
  //   yiiEditor.value?.editor.extensionManager.extensions
  // )
  // console.debug('darkMode', yiiEditor.value?.darkMode)
  // console.debug('local', yiiEditor.value?.local)
})

onMounted(() => {
  init()
})
</script>

<style lang="scss">
.page-simple-editor {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  color: var(--yii-color-accent);
  background: var(--yii-bg-color);

  .toolbar-container {
    height: 108px;
    header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;

      .info {
        display: flex;
        align-items: center;
        .logo {
          width: 32px;
          height: 32px;
        }
        img {
          width: 100%;
          height: 100%;
        }

        .title {
          padding: 0 4px;
          font-size: 20px;
        }

        .version {
          height: 20px;
          img {
            width: unset;
            height: 100%;
          }
        }
      }

      .actions {
        display: flex;
        align-items: center;

        .n-button {
          padding: 0 8px;
          margin-left: 4px;
        }
      }
    }

    .toolbar {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: solid 1px rgba(0, 0, 0, 0.05);
      border-bottom: solid 1px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    }
  }

  .content-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 108px;
    bottom: 0;
    overflow: auto;

    .layout {
      display: grid;
      grid-template-rows:
        auto
        1fr;

      &.page {
        grid-template-columns:
          [full-start] minmax(100px, 1fr)
          [content-start] minmax(400px, 800px)
          [content-end] minmax(100px, 1fr)
          [full-end];
      }

      &.full {
        grid-template-columns:
          [full-start] 100px
          [content-start] 1fr
          [content-end] 100px
          [full-end];
      }

      &-full {
        grid-column: full;
      }

      &-content {
        grid-column: content;
      }

      &-right {
        grid-column: content-end / full-end;
        grid-row: 1;

        .sticky-top {
          position: sticky;
          top: 0;
        }
        .o-doc-toc {
          position: absolute;
          right: 20px;
        }
      }
    }
  }
}

.n-drawer {
  .action {
    margin-bottom: 14px;
  }

  h3 {
    margin: 0;
  }

  .n-divider {
    margin: 1rem 0;
  }
}

*:has(.is-dragging) {
  background: transparent !important;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: var(--yii-bg-color);
}

::-webkit-scrollbar-thumb {
  background-color: var(--yii-caption-color);
  width: 4px;
  border-radius: 3px;
}

/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}
</style>

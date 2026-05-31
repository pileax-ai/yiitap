<template>
  <section class="page-code-editor" :class="{ dark: darkMode }">
    <n-drawer
      v-model:show="showDrawer"
      :default-width="400"
      placement="right"
      resizable
    >
      <n-drawer-content title="Yii Code Editor" closable>
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

          <h3>Pages</h3>
          <n-divider />
          <n-menu :options="menuOptions" />
        </n-form>
      </n-drawer-content>
    </n-drawer>

    <section class="toolbar-container">
      <header>
        <section class="info">
          <div class="logo">
            <a href="/">
              <img src="/logo.png" alt="Logo" />
            </a>
          </div>
          <div class="title">Yiitap Code</div>
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
        <YiiCodeEditor
          ref="yiiEditor"
          class="layout-content"
          v-bind="editorOptions"
          @update="onUpdate"
        />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeMount } from 'vue'
import {
  NButton,
  NDivider,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NMenu,
  NSelect,
  NSwitch,
} from 'naive-ui'
import '@google/model-viewer'
import {
  YiiCodeEditor,
  OIcon,
  removeHtmlAttributes,
  type JSONContent,
} from '@yiitap/vue'
import type { Editor } from '@yiitap/vue'
import { SupportLanguages } from '@yiitap/i18n'
import VersionBadge from '../components/VersionBadge.vue'
import 'katex/dist/katex.min.css'
import { menuOptions } from '@/constants/menu'

const emit = defineEmits(['mode'])

const yiiEditor = ref<InstanceType<typeof YiiCodeEditor>>()
const locale = ref('en-US')
const darkMode = ref(false)
const editable = ref(true)
const showDrawer = ref(false)
const DEBUG = true

const editorOptions = computed(() => {
  return {
    locale: locale.value,
    darkMode: darkMode.value,
    editable: editable.value,
    content:
      '<pre><code class="language-javascript">console.log(\'Hello World\')</code></pre>',
    pageView: 'page',
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

function init() {
  try {
    locale.value = localStorage.getItem('yiitap.locale') || 'en-US'
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

function onUpdate({
  editor,
  language,
  code,
}: {
  editor: Editor
  language: string
  code: string
}) {
  // Get content of editor
  // console.log(editor.getJSON())

  // markdown
  // const markdown = editor.markdown?.serialize(editor.getJSON())
  // console.log(markdown)

  if (import.meta.env.DEV && DEBUG) {
    console.debug(removeHtmlAttributes(editor.getHTML(), '[data-id]'))
    console.debug(editor.getJSON())

    // code
    console.debug('language', language)
    console.debug('code', code)
  }
}

watch(locale, (newValue) => {
  localStorage.setItem('yiitap.locale', newValue)
})

watch(editor, (newValue) => {
  if (import.meta.env.DEV) {
    // Access properties exposed by YiiEditor
    // console.debug('editor', yiiEditor.value?.editor)
    console.debug(
      'extensions',
      yiiEditor.value?.editor.extensionManager.extensions
    )
    // console.debug('darkMode', yiiEditor.value?.darkMode)
    // console.debug('local', yiiEditor.value?.local)
  }
})

onBeforeMount(() => {
  init()
})
</script>

<style lang="scss">
.page-code-editor {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  color: var(--yii-color-accent);
  background: var(--yii-bg-color);

  .toolbar-container {
    height: 60px;
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
  }

  .content-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
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
</style>

<template>
  <o-node-view
    v-bind="props"
    class="o-encrypted-block-view has-toolbar"
    :class="{
      'show-toolbar': toolbarShown,
      readonly: !editor?.isEditable,
      init: !ciphertext,
    }"
    as="div"
    @contextmenu.prevent="onContextMenu"
    @click="onClick"
  >
    <o-block-popover v-model="showPopover" placement="bottom">
      <template #popover-content>
        <o-encrypted-password
          :editor="editor"
          @confirm="onShowPopover(false)"
          v-if="popoverView === 'password'"
        />
        <o-encrypted-form :editor="editor" @confirm="onSave" v-else />
      </template>

      <o-block-placeholder
        icon="lock"
        :placeholder="tr('label.encrypted.blockEmpty')"
        v-if="!ciphertext"
      />
      <div class="encrypted-block-container" v-else>
        <toolbar
          v-bind="props"
          :decrypted="decrypted"
          :revealed="revealed"
          :text="decryptedText"
          @action="onAction"
        />

        <o-block-placeholder :icon="revealIcon" :autogrow="revealed">
          <template v-if="revealed">
            <o-textarea
              v-model="text"
              :readonly="!isEditable"
              @blur="onSaving"
            />
          </template>
          <template v-else>
            {{ tr('label.encrypted.content') }}
          </template>
        </o-block-placeholder>
      </div>
    </o-block-popover>

    <o-context-menu v-model="showContextMenu" :event="mouseEvent">
      <o-block-menu v-bind="props" @action="onAction" />
    </o-context-menu>

    <o-dialog
      v-model:show="dialogOptions.show"
      v-bind="dialogOptions"
      :title="tr('editor.encryptedBlock')"
      dialog-class="encrypted-block-dialog small"
    >
      <div class="encrypted-block-container">
        <header>
          <o-icon-label
            icon="shield"
            :label="tr('label.content')"
            class="o-tips"
          />
        </header>
        <o-textarea v-model="text" @blur="onSaving" />
      </div>
    </o-dialog>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { arrayToBase64, encryptText } from '@yiitap/core'
import { getEncryptionMeta } from '@yiitap/extension-encrypted'
import { useI18n, useTiptap, MasterKeys } from '../../../hooks'
import {
  OBlockMenu,
  OBlockPlaceholder,
  OBlockPopover,
  OContextMenu,
  ODialog,
  OEncryptedForm,
  OEncryptedPassword,
  OIconLabel,
  ONodeView,
  OTextarea,
} from '../../../components/index'
import Toolbar from './toolbar.vue'
import type { DialogOption } from '../../../types/types'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { isEditable } = useTiptap()
const showContextMenu = ref(false)
const mouseEvent = ref({})
const popoverView = ref('form')
const showPopover = ref(false)
const toolbarShown = ref(false)
const decrypted = ref(false)
const decryptedText = ref('')
const text = ref('')
const revealed = ref(false)
const savingIcon = ref('')

const dialogOptions = ref<DialogOption>({
  show: false,
  fullscreen: false,
})

const ciphertext = computed({
  get() {
    return props.node.attrs.ciphertext
  },
  set(value) {
    props.updateAttributes({ ciphertext: value })
  },
})

const meta = computed(() => {
  return getEncryptionMeta(props.editor.state)
})

const masterKey = computed({
  get() {
    if (meta.value?.salt) {
      const id = arrayToBase64(meta.value.salt)
      return MasterKeys.get(id) ?? null
    } else {
      return null
    }
  },
  set(value) {
    if (props.editor && meta.value?.salt) {
      const id = arrayToBase64(meta.value.salt)
      MasterKeys.set(id, value)
    }
  },
})

const revealIcon = computed(() => {
  const icon = revealed.value ? 'lock_open' : 'lock'
  return savingIcon.value || icon
})

function onAction(action: Indexable) {
  showContextMenu.value = false
  switch (action.value) {
    case 'encrypted_password':
      popoverView.value = 'password'
      showPopover.value = true
      break
    case 'preview':
      dialogOptions.value.show = true
      break
    case 'replace':
      onShowPopover(true)
      break
    case 'reveal':
      revealed.value = !revealed.value
      break
    case 'show':
      toolbarShown.value = action.show
      break
  }

  if (action.decrypted) {
    decrypted.value = true
    decryptedText.value = action.text
    text.value = action.text
  }
}

function onClick() {
  if (!ciphertext.value) {
    onShowPopover(true)
  }
}

function onContextMenu(e: MouseEvent) {
  showContextMenu.value = true
  mouseEvent.value = e
}

function onSave(name: string, value: Indexable) {
  savingIcon.value = 'done'
  props.updateAttributes({
    ciphertext: value.ciphertext,
    iv: value.iv,
  })
  onShowPopover(false)

  setTimeout(() => {
    savingIcon.value = ''
  }, 1000)
}

async function onSaving() {
  if (text.value !== decryptedText.value) {
    if (text.value) {
      const obj = await encryptText(text.value, masterKey.value)
      onSave('saving', obj)
    } else {
      onSave('saving', { ciphertext: '', iv: [] })
    }
    decryptedText.value = text.value
  }
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}

watch(meta, (newValue) => {
  // Reset
  decrypted.value = false
  decryptedText.value = ''
  text.value = ''
  revealed.value = false
  savingIcon.value = ''
})

onMounted(() => {
  onShowPopover(ciphertext.value === '')
})
</script>

<style lang="scss">
.o-encrypted-block-view {
  position: relative;
  display: block;
  cursor: pointer;
  width: 100%;
  margin: 6px 0;

  .encrypted-block-container {
    position: relative;
    min-height: 40px;

    .o-textarea {
      display: unset;
      padding: 0;
      outline: none !important;

      &:has(textarea:focus) {
        background: none;
        outline: none;
      }

      textarea {
        min-height: unset;
      }
    }

    .o-block-toolbar {
      position: absolute;
      top: 8px;
      right: 5px;
      display: flex;
      z-index: 1;
    }

    encrypted-block {
      display: block;
      width: 100%;
      height: 400px;
      border-radius: 3px;
      object-fit: cover;
      vertical-align: middle;
    }
  }
}

.encrypted-block-dialog {
  .dialog-box {
    height: unset;
    width: 50vw;
    min-width: unset !important;
    min-height: unset !important;
    max-width: 700px !important;
    max-height: 600px !important;

    .dialog-body {
      display: block;
    }
  }

  .encrypted-block-container {
    padding: 1rem;

    .o-textarea {
      display: block;
      margin-top: 4px;
    }
  }
}
</style>

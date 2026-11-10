<template>
  <o-node-view
    v-bind="props"
    class="o-encrypted-block-view"
    :class="{
      readonly: !editor?.isEditable,
      init: !ciphertext,
    }"
    as="div"
    @contextmenu.prevent="onContextMenu"
    @click="onClick"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="!ciphertext ? 'bottom' : 'top'"
    >
      <template #popover-content>
        <o-encrypted-form
          :editor="editor"
          type="model"
          :on-upload="onUpload"
          @confirm="onSave"
        />
      </template>

      <o-block-placeholder
        icon="lock"
        :placeholder="tr('label.model3dAdd')"
        v-if="!ciphertext"
      />
      <div class="encrypted-block-container" v-else>
        <toolbar v-bind="props" :revealed="revealed" @action="onAction" />

        <o-block-placeholder
          :icon="revealIcon"
          :autogrow="revealed"
        >
          <template v-if="revealed">
            <o-textarea v-model="text" :readonly="!isEditable" @blur="onSaving" />
          </template>
          <div v-else>
            Encrypted content
          </div>
        </o-block-placeholder>
      </div>
    </o-block-popover>

    <o-context-menu v-model="showContextMenu" :event="mouseEvent">
      <o-block-menu v-bind="props" @action="onAction" />
    </o-context-menu>

    <o-dialog
      v-model:show="dialogOptions.show"
      v-bind="dialogOptions"
      :title="tr('label.model3d')"
      dialog-class="encrypted-block-dialog"
    >
      <div class="encrypted-block-container">
        <div v-html="text" />
      </div>
    </o-dialog>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { useI18n, useTiptap } from '../../../hooks'
import {
  OBlockMenu,
  OBlockPlaceholder,
  OBlockPopover,
  OContextMenu,
  ODialog,
  OEncryptedForm,
  ONodeView,
  OTextarea,
} from '../../../components/index'
import Toolbar from './toolbar.vue'
import type { DialogOption } from '../../../types/types'
import { encryptText } from '../../../utils/crypto'

const props = defineProps(nodeViewProps)

const onUpload = (props.editor.storage as any).uploadManager?.onUpload
const { tr } = useI18n()
const { isEditable } = useTiptap()
const showContextMenu = ref(false)
const mouseEvent = ref({})
const showPopover = ref(false)
const revealed = ref(false)
const revealedText = ref('')
const text = ref('')
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

const masterKey = computed(() => {
  return props.editor?.storage.encryptionMetadata.masterKey
})

const revealIcon = computed(() => {
  const icon = revealed.value ? 'lock_open' : 'lock'
  return savingIcon.value || icon
})

function onAction(action: Indexable) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onShowPopover(true)
      break
    case 'revealed':
      revealed.value = action.revealed
      revealedText.value = action.text
      text.value = action.text
      break
    case 'preview':
      revealed.value = action.revealed
      revealedText.value = action.text
      text.value = action.text
      dialogOptions.value.show = true
      break
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
  console.log(name, value)
  savingIcon.value = 'done'
  props.updateAttributes({
    ciphertext: value.ciphertext,
    iv: value.iv
  })
  onShowPopover(false)

  setTimeout(() => {
    savingIcon.value = ''
  }, 1000)
}

async function onSaving() {
  if (text.value !== revealedText.value) {
    if (text.value) {
      const obj = await encryptText(text.value, masterKey.value)
      onSave('saving', obj)
    } else {
      onSave('saving', { ciphertext: '', iv: [] })
    }
    revealedText.value = text.value
  }
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}
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
  .encrypted-block-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    encrypted-block {
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

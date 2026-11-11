<template>
  <o-popover
    ref="popover"
    placement="bottom-end"
    size="medium"
    trigger="manual"
    class="o-encrypted-block-toolbar"
    :offset="[0, 46]"
    :show-arrow="false"
  >
    <template #trigger>
      <o-block-toolbar v-bind="props" @action="onAction">
        <o-menubar-btn
          :icon="revealed ? 'visibility_off' : 'visibility'"
          tooltip="Reveal"
          @click="onReveal('revealed')"
        />
        <template v-if="isEditable">
          <o-menubar-btn
            icon="crop_free"
            :tooltip="tr('image.zoom')"
            @click="onReveal('preview')"
          />
        </template>
      </o-block-toolbar>
    </template>

    <o-input
      ref="input"
      v-model="password"
      type="text"
      placeholder="Input password"
      :class="{ 'error': error.error }"
      autofocus
      clearable
      @keydown.enter.prevent="onVerify"
      @clear="error = {}"
    >
      <template #prefix>
        <o-icon name="function" class="o-tips" />
      </template>
      <template #suffix>
        <o-icon
          name="keyboard_return"
          class="clear o-tips"
          @click="onVerify"
          v-if="password"
        />
      </template>
      <template #bottom>
        <span class="o-text-error" v-if="error.message">
            {{ error.message }}
          </span>
        <div v-else-if="docAttrs.masterTips">
          <o-icon-label icon="info"
                        :label="docAttrs.masterTips"
                        class="o-tips"
                        icon-class="small" />
        </div>
      </template>
    </o-input>
  </o-popover>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { useI18n, useTiptap } from '../../../hooks'
import {
  OPopover,
  OBlockToolbar,
  OMenubarBtn,
  OIcon,
  OIconLabel,
  OInput,
} from '../../../components/index'
import {
  verifyMasterPassword,
  encryptText,
  decryptText,
} from '../../../utils/crypto'

const props = defineProps({
  ...nodeViewProps,
  revealed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'link',
  },
  trigger: {
    type: String,
    default: 'click',
  },
})
const emit = defineEmits(['action'])

const { locale, tr } = useI18n()
const { isEditable, run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()
const input = ref<InstanceType<typeof OInput>>()
const verifySource = ref('')
const password = ref('')
const error = ref<Indexable>({
  error: false,
  message: ''
})

const docAttrs = computed(() => {
  return props.editor?.state.doc.attrs
})

const iv = computed({
  get() {
    return props.node.attrs.iv
  },
  set(value) {
    props.updateAttributes({ iv: value })
  },
})

const ciphertext = computed({
  get() {
    return props.node.attrs.ciphertext
  },
  set(value) {
    props.updateAttributes({ ciphertext: value })
  },
})

const masterKey = computed({
  get() {
    return props.editor?.storage.encryptionMetadata.masterKey
  },
  set(value) {
    if (props.editor) {
      props.editor.storage.encryptionMetadata.masterKey = value
    }
  },
})

function onShowPopover(source = '') {
  verifySource.value = source
  popover.value?.setShow(true)
  setTimeout(() => {
    input.value?.focus()
  }, 100)
}

async function onVerify() {
  try {
    const attrs = docAttrs.value
    const key = await verifyMasterPassword(password.value, attrs.masterSalt, attrs.masterVerifyCipher, attrs.masterVerifyIv)
    if (key) {
      console.log('key', key, verifySource.value)
      masterKey.value = key
      onReveal(verifySource.value)
      error.value = {}
    } else {
      error.value = {
        error: true,
        message: 'Token不正确'
      }
    }
  } catch (err) {
    error.value = {
      error: true,
      message: err.message
    }
  }
}

async function onReveal(source: string) {
  if (!masterKey.value) {
    onShowPopover(source)
    return
  }

  try {
    const text = await decryptText(ciphertext.value, iv.value, masterKey.value)
    console.log('onReveal', source, masterKey.value, text)
    emit('action', {
      value: source,
      revealed: !props.revealed,
      text
    })
    popover.value?.setShow(false)
  } catch (err) {
    error.value = { error: false, message: '解密失败' }
    onShowPopover(source)
  }
}

function onAction(item: Indexable) {
  emit('action', item)
  popover.value?.setShow(false)
}
</script>

<style lang="scss">
.o-encrypted-block-toolbar {

}
</style>

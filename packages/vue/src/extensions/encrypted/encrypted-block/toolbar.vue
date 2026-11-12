<template>
  <o-popover
    ref="popover"
    placement="bottom-end"
    size="medium"
    trigger="manual"
    class="o-encrypted-block-toolbar"
    tippy-class="o-encrypted-block-toolbar-popover"
    :offset="[0, 46]"
    :show-arrow="false"
    @update:show="emit('action', { value: 'show', show: $event })"
  >
    <template #trigger>
      <o-block-toolbar v-bind="props" @action="onAction">
        <o-menubar-btn
          :icon="revealed ? 'visibility_off' : 'visibility'"
          :tooltip="tr('label.encrypted.reveal')"
          @click="onDecrypt('reveal')"
        />
        <o-menubar-btn
          icon="crop_free"
          :tooltip="tr('label.preview')"
          @click="onDecrypt('preview')"
        />
        <template v-if="decrypted">
          <o-copy-btn :text="text" />
        </template>
      </o-block-toolbar>
    </template>

    <o-input
      ref="input"
      v-model="password"
      type="password"
      :placeholder="tr('label.encrypted.password')"
      :class="{ 'error': error.error }"
      autofocus
      clearable
      @keydown.enter.prevent="onVerify"
      @clear="error = {}"
    >
      <template #prefix>
        <o-icon name="password" class="o-tips" />
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
        <div v-else-if="meta?.tips">
          <o-icon-label icon="info"
                        :label="meta.tips"
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
import { arrayToBase64, verifyMasterPassword, decryptText, type MasterPasswordMeta } from '@yiitap/core'
import { getEncryptionMeta } from '@yiitap/extension-encrypted'
import { useI18n, useTiptap, MasterKeys } from '../../../hooks'
import {
  OPopover,
  OBlockToolbar,
  OCopyBtn,
  OMenubarBtn,
  OIcon,
  OIconLabel,
  OInput,
} from '../../../components/index'

const props = defineProps({
  ...nodeViewProps,
  decrypted: {
    type: Boolean,
    default: false,
  },
  revealed: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  },
  trigger: {
    type: String,
    default: 'click',
  },
})
const emit = defineEmits(['action', 'update:show'])

const { tr } = useI18n()
const { isEditable, run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()
const input = ref<InstanceType<typeof OInput>>()
const verifySource = ref('')
const password = ref('')
const error = ref<Indexable>({
  error: false,
  message: ''
})

const meta = computed(() => {
  return getEncryptionMeta(props.editor.state)
})

const iv = computed(() => {
  return props.node.attrs.iv
})

const ciphertext = computed(() => {
  return props.node.attrs.ciphertext
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

function onShowPopover(source = '') {
  verifySource.value = source
  popover.value?.setShow(true)
  setTimeout(() => {
    input.value?.focus()
  }, 100)
}

async function onVerify() {
  try {
    if (!meta.value) {
      return
    }
    const attrs = meta.value as MasterPasswordMeta
    const result = await verifyMasterPassword(password.value, attrs)
    if (result.ok) {
      masterKey.value = result.key
      onDecrypt(verifySource.value)
      onReset()
    } else {
      error.value = {
        error: true,
        message: 'Incorrect password or tampered ciphertext/IV'
      }
    }
  } catch (err) {
    error.value = {
      error: true,
      message: err.message
    }
  }
}

async function onDecrypt(source: string) {
  if (!masterKey.value) {
    onShowPopover(source)
    return
  }

  if (props.decrypted) {
    emit('action', {
      value: source,
    })
    return
  }

  try {
    const text = await decryptText(ciphertext.value, iv.value, masterKey.value)
    emit('action', {
      value: source,
      decrypted: true,
      text
    })
    popover.value?.setShow(false)
  } catch (err) {
    error.value = { error: false, message: tr('label.encryted.errorDecrypt') }
    onShowPopover(source)
  }
}

function onAction(item: Indexable) {
  emit('action', item)
  popover.value?.setShow(false)
}

function onReset() {
  error.value = {}
  password.value = ''
}
</script>

<style lang="scss">
.o-encrypted-block-toolbar {
  &-popover {
    .o-input {
      min-width: 280px;
    }
  }
}
</style>

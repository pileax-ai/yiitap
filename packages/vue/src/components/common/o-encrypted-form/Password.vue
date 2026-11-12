<template>
  <section class="o-media-link">
    <form class="o-fields o-form" @submit.prevent="onConfirm">
      <o-input
        ref="input"
        v-model="password"
        :placeholder="tr('label.encrypted.password')"
        type="password"
        autocomplete="new-password"
        :class="{ 'error': error.password?.error }"
        autofocus
        clearable
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
      </o-input>
      <o-input
        v-model="rePassword"
        :placeholder="tr('label.encrypted.rePassword')"
        type="password"
        autocomplete="re-password"
        :class="{ 'error': error.rePassword?.error }"
        clearable
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
      </o-input>
      <o-input
        v-model="tips"
        :placeholder="tr('label.encrypted.passwordTips')"
        clearable
      >
        <template #prefix>
          <o-icon name="info" class="o-tips" />
        </template>
      </o-input>
    </form>
    <footer class="actions">
      <o-btn type="info" @click.stop="onConfirm">
        {{ tr('label.next') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { arrayToBase64, setupMasterPassword, CurrentEncryptionVersion } from '@yiitap/core'
import { OBtn, OIcon, OInput } from '../../index'
import { useI18n, MasterKeys } from '../../../hooks'

const props = defineProps({
  editor: {
    type: Editor,
  },
  val: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['next'])

const { tr } = useI18n()
const input = ref<InstanceType<typeof OInput>>()
const password = ref('')
const rePassword = ref('')
const tips = ref('')
const error = ref({
  password: { error: false, message: '' },
  rePassword: { error: false, message: '' },
})

async function onConfirm() {
  if (!validate() || !props.editor) return

  const { version, salt, ciphertext, iv, key } = await setupMasterPassword(CurrentEncryptionVersion, password.value)

  props.editor.chain().focus().setEncryptionMeta({
    version,
    tips: tips.value,
    salt,
    ciphertext,
    iv,
  }).run()
  const id = arrayToBase64(salt)
  MasterKeys.set(id, key)

  emit('next', 'content')
}

function validate(): boolean {
  const newError = {
    password: { error: false, message: '' },
    rePassword: { error: false, message: '' },
  }

  if (!password.value) {
    newError.password = { error: true, message: 'Required' }
    error.value = newError
    return false
  }

  if (!rePassword.value) {
    newError.rePassword = { error: true, message: 'Required' }
    error.value = newError
    return false
  }

  if (password.value !== rePassword.value) {
    newError.rePassword = { error: true, message: 'Password not match' }
    error.value = newError
    return false
  }

  error.value = newError
  return true
}

onMounted(() => {
  password.value = props.val

  setTimeout(() => {
    input.value?.focus()
  }, 100)
})
</script>

<style lang="scss">
.o-media-link {
  min-width: 500px;

  .o-media-title {
    padding-bottom: 14px;
    font-size: 16px;
    font-weight: 600;
  }

  .actions {
    display: flex;
    justify-content: center;
    padding-top: 1rem;

    .o-btn {
      min-width: 120px;
    }
  }
}
</style>

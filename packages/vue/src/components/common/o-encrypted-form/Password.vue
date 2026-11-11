<template>
  <section class="o-media-link">
    <form class="o-fields o-form">
      <o-input
        ref="input"
        v-model="password"
        placeholder="Password"
        type="password"
        autocomplete="new-password"
        :class="{ 'error': error.password?.error }"
        autofocus
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
      </o-input>
      <o-input
        v-model="rePassword"
        placeholder="Password again"
        type="password"
        autocomplete="re-password"
        :class="{ 'error': error.rePassword?.error }"
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
      </o-input>
      <o-input
        v-model="tips"
        placeholder="Password tips"
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="info" class="o-tips" />
        </template>
      </o-input>
      <input
        type="text"
        name="username"
        autocomplete="username"
        value="the-actual-username"
        class="o-field hidden"
      />
    </form>
    <footer class="actions">
      <o-btn type="info" @click.stop="onConfirm">
        Next
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { OBtn, OIcon, OInput } from '../../index'

import useI18n from '../../../hooks/useI18n'
import {
  setupMasterPassword,
} from '../../../utils/crypto'

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

  const { salt, masterVerifyCipher, masterVerifyIv, key } = await setupMasterPassword(password.value)

  props.editor.chain().focus().setMasterPasswordMeta({
    masterSalt: salt,
    masterTips: tips.value,
    masterVerifyCipher,
    masterVerifyIv,
  }).run()
  props.editor.storage.encryptionMetadata.masterKey = key

  emit('next', 'content')
}

function validate() {
  error.value = {
    password: { error: false, message: '' },
    rePassword: { error: false, message: '' },
  }
  if (!password.value) {
    error.value.password = {
      error: true,
      message: 'Required',
    }
    return false
  } else {
    error.value.password = { error: false, message: '' }
  }

  if (!rePassword.value) {
    error.value.rePassword = {
      error: true,
      message: 'Required',
    }
    return false
  } else {
    error.value.rePassword = { error: false, message: '' }
  }

  if (password.value !== rePassword.value) {
    error.value.rePassword = {
      error: true,
      message: 'Password not match',
    }
    return false
  }

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

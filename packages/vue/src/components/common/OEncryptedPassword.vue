<template>
  <section class="o-encrypted-password">
    <header class="tab-container">
      <div class="tabs">
        {{ tr('label.encrypted.changePassword') }}
      </div>
      <div>
        <div class="type">
          {{ tr('label.encrypted.encryption') }}
        </div>
      </div>
    </header>

    <section class="tab-panels">
      <form class="o-fields o-form" @submit.prevent="onConfirm">
        <o-input
          ref="input"
          v-model="oldPassword"
          :placeholder="tr('label.encrypted.oldPassword')"
          :error-message="error?.oldPassword.message"
          type="password"
          autocomplete="old-password"
          :class="{ error: error.oldPassword?.error }"
          autofocus
          clearable
        >
          <template #prefix>
            <o-icon name="lock" class="o-tips" />
          </template>
          <template #bottom>
            <span class="o-tips" v-if="meta?.tips">
              {{ meta.tips }}
            </span>
          </template>
        </o-input>

        <section class="new-password-container">
          <div class="o-tips">{{ tr('label.encrypted.newPassword') }}</div>
          <o-input
            v-model="password"
            :placeholder="tr('label.encrypted.password')"
            :error-message="error?.password.message"
            type="password"
            autocomplete="new-password"
            :class="{ error: error.password?.error }"
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
            :error-message="error?.rePassword.message"
            type="password"
            autocomplete="re-password"
            :class="{ error: error.rePassword?.error }"
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
        </section>
      </form>
    </section>
    <footer class="actions">
      <o-btn type="info" :loading="loading" @click.stop="onConfirm">
        {{ tr('label.ok') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Editor } from '@tiptap/core'
import {
  arrayToBase64,
  setupMasterPassword,
  CurrentEncryptionVersion,
  type MasterPasswordMeta,
  verifyMasterPassword,
} from '@yiitap/core'
import {
  getEncryptionMeta,
  changeMasterPassword,
} from '@yiitap/extension-encrypted'
import { useI18n, MasterKeys } from '../../hooks'
import { OBtn, OIcon, OInput } from '../../index'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const emit = defineEmits(['confirm'])

const { tr } = useI18n()
const input = ref<InstanceType<typeof OInput>>()
const loading = ref(false)
const oldPassword = ref('')
const password = ref('')
const rePassword = ref('')
const tips = ref('')
const error = ref({
  oldPassword: { error: false, message: '' },
  password: { error: false, message: '' },
  rePassword: { error: false, message: '' },
})

const meta = computed(() => {
  return getEncryptionMeta(props.editor.state)
})

async function verify() {
  if (!oldPassword.value) {
    error.value.oldPassword = { error: true, message: 'Required' }
    return false
  }

  try {
    if (!meta.value) {
      error.value.oldPassword = { error: true, message: '无加密元数据' }
      return false
    }

    const attrs = meta.value as MasterPasswordMeta
    const result = await verifyMasterPassword(oldPassword.value, attrs)
    if (result.ok) {
      return true
    } else {
      error.value.oldPassword = {
        error: true,
        message: 'Incorrect password or tampered ciphertext/IV',
      }
      return false
    }
  } catch (err) {
    error.value.oldPassword = { error: true, message: err.message }
  }
  return false
}

function validate(): boolean {
  const newError = {
    oldPassword: { error: false, message: '' },
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

async function onConfirm() {
  if (!(await verify())) return
  if (!validate()) return

  loading.value = true
  const { salt, key } = await setupMasterPassword(
    CurrentEncryptionVersion,
    password.value
  )

  // Change master password
  try {
    await changeMasterPassword(
      props.editor,
      CurrentEncryptionVersion,
      oldPassword.value,
      password.value,
      tips.value
    )
  } catch (err) {
    console.error(err)
  }

  // Update master key
  const oldId = arrayToBase64(meta.value.salt)
  const id = arrayToBase64(salt)
  MasterKeys.delete(oldId)
  MasterKeys.set(id, key)

  // Reset
  reset()
  loading.value = false

  emit('confirm')
}

function reset() {
  oldPassword.value = ''
  password.value = ''
  rePassword.value = ''
  tips.value = ''
  error.value = {
    oldPassword: { error: false, message: '' },
    password: { error: false, message: '' },
    rePassword: { error: false, message: '' },
  }
}

onMounted(() => {
  setTimeout(() => {
    input.value?.focus()
  }, 100)
})
</script>

<style lang="scss">
.popover-content:has(.o-encrypted-password) {
  padding: 8px 0 !important;
}

.o-encrypted-password {
  min-width: 500px;

  .tab-container {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px var(--yii-border-color);
    padding: 0 16px 8px 16px;

    .tabs {
      display: flex;
    }

    .tab {
      color: var(--yii-tips-color);
      padding: 4px 4px;
      margin-right: 4px;
      min-width: 56px;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: var(--yii-color);
      }

      &.active {
        color: var(--yii-color);
        border-bottom: solid 2px var(--yii-color);
      }
    }

    .type {
      padding: 0 6px;
      margin-top: 2px;
      color: var(--yii-tips-color);
      background: var(--yii-active-bg-color);
      border-radius: 2px;
    }
  }

  .tab-panels {
    padding: 1rem 1rem 0 1rem;

    .new-password-container {
      margin-top: 1rem;

      .o-field {
        margin-top: 0.5rem;
      }
    }
  }

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

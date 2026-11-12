<template>
  <section class="o-encrypted-verifier">
    <form class="o-fields o-form" @submit.prevent="onConfirm">
      <o-input
        ref="input"
        v-model="password"
        :placeholder="tr('label.encrypted.password')"
        type="password"
        autocomplete="new-password"
        :class="{ error: error.error }"
        autofocus
        clearable
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
        <template #bottom>
          <span class="o-text-error" v-if="error.message">
            {{ error.message }}
          </span>
          <div v-else-if="meta?.tips">
            <o-icon-label
              icon="info"
              :label="meta.tips"
              class="o-tips"
              icon-class="small"
            />
          </div>
        </template>
      </o-input>
    </form>
    <footer class="actions">
      <o-btn type="info" @click="onConfirm">
        {{ tr('label.next') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Editor } from '@tiptap/core'
import {
  arrayToBase64,
  verifyMasterPassword,
  type MasterPasswordMeta,
} from '@yiitap/core'
import { getEncryptionMeta } from '@yiitap/extension-encrypted'
import { OBtn, OIcon, OIconLabel, OInput } from '../../index'
import { useI18n, MasterKeys } from '../../../hooks'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const emit = defineEmits(['next'])

const { tr } = useI18n()
const input = ref<InstanceType<typeof OInput>>()
const password = ref('')
const error = ref<Indexable>({})

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

async function onConfirm() {
  if (!validate()) return

  try {
    if (!meta.value) {
      error.value = { error: true, message: '无加密元数据' }
      return
    }

    const attrs = meta.value as MasterPasswordMeta
    const result = await verifyMasterPassword(password.value, attrs)
    if (result.ok) {
      masterKey.value = result.key
      emit('next', 'content')
    } else {
      error.value = {
        error: true,
        message: 'Incorrect password or tampered ciphertext/IV',
      }
    }
  } catch (err) {
    error.value = {
      error: true,
      message: err.message,
    }
  }
}

function validate() {
  error.value = {}
  if (!password.value) {
    error.value = {
      error: true,
      message: 'Required',
    }
    return false
  } else {
    error.value = {}
  }

  return true
}

onMounted(() => {
  setTimeout(() => {
    input.value?.focus()
  }, 100)
})
</script>

<style lang="scss">
.o-encrypted-verifier {
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

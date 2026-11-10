<template>
  <section class="o-encrypted-verifier">
    <form class="o-fields o-form">
      <o-input
        ref="input"
        v-model="password"
        placeholder="Password"
        type="password"
        autocomplete="new-password"
        :class="{ 'error': error.error }"
        autofocus
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="lock" class="o-tips" />
        </template>
        <template #bottom>
          <span class="o-text-error">
            {{ error.message }}
          </span>
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
      <o-btn type="info" @click="onConfirm">
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
  verifyMasterPassword,
} from '../../../utils/crypto'

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

const docAttrs = computed(() => {
  return props.editor?.state.doc.attrs
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

async function onConfirm() {
  if (!validate()) return

  try {
    const attrs = docAttrs.value
    const key = await verifyMasterPassword(password.value, attrs.masterSalt, attrs.masterVerifyCipher, attrs.masterVerifyIv)
    if (key) {
      masterKey.value = key
      emit('next', 'content')
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

function validate() {
  error.value = {}
  if (!password.value) {
    error.value = {
      error: true,
      message: 'Required',
    }
    return false
  } else {
    error.value = { }
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

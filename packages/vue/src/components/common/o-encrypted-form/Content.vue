<template>
  <section class="o-encrypted-content">
    <section class="o-form o-fields">
      <o-textarea
        ref="input"
        v-model="value"
        :placeholder="tr('label.content')"
        :class="inputStatus"
        autofocus
        clearable
      >
        <template #prefix>
          <o-icon name="shield" class="o-tips" />
        </template>
      </o-textarea>
    </section>
    <footer class="actions">
      <o-btn type="info" :disabled="!passwordReady" @click="onConfirm">
        {{ tr('label.ok') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { arrayToBase64, encryptText } from '@yiitap/core'
import { getEncryptionMeta } from '@yiitap/extension-encrypted'
import { OBtn, OIcon, OTextarea } from '../../index'

import { useI18n, MasterKeys } from '../../../hooks'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const emit = defineEmits(['confirm'])

const { tr } = useI18n()
const input = ref<InstanceType<typeof OTextarea>>()
const inputStatus = ref('')
const value = ref('')

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

const passwordReady = computed(() => {
  return !!meta.value?.ciphertext
})

function validate() {
  if (value.value) {
    inputStatus.value = ''
    return true
  } else {
    inputStatus.value = 'error'
    return false
  }
}

async function onConfirm() {
  if (!validate()) return

  const obj = await encryptText(value.value, masterKey.value)
  emit('confirm', obj)
}

onMounted(() => {
  setTimeout(() => {
    input.value?.focus()
  }, 100)
})
</script>

<style lang="scss">
.o-encrypted-content {
  max-width: 468px;

  .o-textarea {
    //min-height: 100px;
    textarea {
      min-height: 60px;
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

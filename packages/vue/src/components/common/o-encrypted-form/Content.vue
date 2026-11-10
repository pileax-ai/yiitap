<template>
  <section class="o-encrypted-content">
    <section class="o-form o-fields">
      <o-textarea
        ref="input"
        v-model="value"
        placeholder="Content"
        :class="inputStatus"
        autofocus
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="shield" class="o-tips" />
        </template>
      </o-textarea>
    </section>
    <footer class="actions">
      <o-btn type="info"
             :disabled="!passwordReady"
             @click="onConfirm">
        {{ tr('label.ok') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { OBtn, OIcon, OTextarea } from '../../index'

import useI18n from '../../../hooks/useI18n'
import {
  encryptText,
  decryptText,
} from '../../../utils/crypto'

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

const docAttrs = computed(() => {
  return props.editor?.state.doc.attrs
})

const passwordReady = computed(() => {
  return docAttrs.value.masterVerifyCipher
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
  const text = await decryptText(obj.ciphertext, obj.iv, masterKey.value)
  console.log('text', text)

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

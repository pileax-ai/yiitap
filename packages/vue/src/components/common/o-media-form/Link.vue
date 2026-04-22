<template>
  <section class="o-media-link">
    <section class="fields">
      <o-input
        ref="input"
        v-model="value"
        :placeholder="placeholder"
        :status="inputStatus"
        type="text"
        autofocus
        clearable
        @enter="onConfirm"
      >
        <template #prefix>
          <o-icon name="link" class="o-tips" />
        </template>
      </o-input>
    </section>
    <footer class="actions">
      <o-btn type="info" @click="onConfirm">
        {{ tr('label.ok') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { OBtn, OIcon, OInput } from '../../index'

import useI18n from '../../../hooks/useI18n'

const props = defineProps({
  val: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['input'])

const placeholder = computed(() => {
  switch (props.type) {
    case 'image':
    case 'video':
    case 'model':
      return tr(`label.linkPlaceholder.${props.type}`)
    default:
      return tr('label.link')
  }
})

const { tr } = useI18n()
const input = ref<InstanceType<typeof OInput>>()
const inputStatus = ref('')
const value = ref('')

function validate() {
  if (value.value) {
    inputStatus.value = 'null'
    return true
  } else {
    inputStatus.value = 'error'
    return false
  }
}

function onConfirm() {
  if (!validate()) return

  emit('input', value.value)
}

onMounted(() => {
  value.value = props.val

  setTimeout(() => {
    input.value?.focus()
  }, 0)
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

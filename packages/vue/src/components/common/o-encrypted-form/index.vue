<template>
  <section class="o-encrypted-form">
    <header class="tab-container">
      <div class="tabs">
        <template v-for="(item, index) in tabs" :key="index">
          <div
            class="tab"
            :class="{ active: item.value === currentTab }"
            v-if="item.show"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
      <div>
        <div class="type">
          {{ tr('label.encrypted.encryption') }}
        </div>
      </div>
    </header>

    <section class="tab-panels">
      <template v-for="(item, index) in tabs" :key="index">
        <div class="tab-panel" v-if="item.value === currentTab">
          <component :is="item.component"
                     v-bind="props"
                     @confirm="onConfirm"
                     @next="onNext" />
        </div>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import {ref, computed, type PropType, onMounted, watch} from 'vue'
import { Editor } from '@tiptap/core'
import { arrayToBase64 } from '@yiitap/core'
import { getEncryptionMeta } from '@yiitap/extension-encrypted'
import Content from './Content.vue'
import Password from './Password.vue'
import Verifier from './Verifier.vue'

import { useI18n, MasterKeys } from '../../../hooks'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const emit = defineEmits(['confirm'])

const currentTab = ref('content')
const { tr } = useI18n()

const meta = computed(() => {
  return getEncryptionMeta(props.editor.state)
})

const passwordReady = computed(() => {
  return !!meta.value?.ciphertext
})

const verified = computed(() => {
  if (meta.value?.salt) {
    const id = arrayToBase64(meta.value.salt)
    return !!(MasterKeys.get(id) ?? null)
  } else {
    return false
  }
})

const tabs = computed(() => {
  return [
    { label: tr('label.encrypted.masterPassword'), value: 'password', component: Password, show: !passwordReady.value },
    { label: tr('label.encrypted.verify'), value: 'verifier', component: Verifier, show: passwordReady.value && !verified.value },
    { label: tr('label.content'), value: 'content', component: Content, show: true },
  ]
})

function onConfirm(val: string) {
  emit('confirm', currentTab.value, val)
}

function onNext(name: string) {
  currentTab.value = name
}

watch(verified, (newValue) => {
  currentTab.value = passwordReady.value
    ? verified.value ? 'content' : 'verifier'
    : 'password'
})

onMounted(() => {
  currentTab.value = passwordReady.value
    ? verified.value ? 'content' : 'verifier'
    : 'password'
})
</script>

<style lang="scss">
.popover-content:has(.o-encrypted-form) {
  padding: 8px 0 !important;
}

.o-encrypted-form {
  min-width: 500px;

  .tab-container {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px var(--yii-border-color);
    padding: 0 16px;

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

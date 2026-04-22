<template>
  <section class="o-media-form">
    <header class="tabs">
      <template v-for="(item, index) in tabs" :key="index">
        <div
          class="tab"
          :class="{ active: item.value === currentTab }"
          @click="currentTab = item.value"
        >
          {{ item.label }}
        </div>
      </template>
    </header>

    <section class="tab-panels">
      <template v-for="(item, index) in tabs" :key="index">
        <div class="tab-panel" v-if="item.value === currentTab">
          <component
            :is="item.component"
            v-bind="props"
            @input="emit('input', $event)"
          />
        </div>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import Link from './Link.vue'
import Upload from './Upload.vue'

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
  onUpload: {
    type: Function as PropType<(file: File, type: string) => Promise<string>>,
    default: undefined,
  },
})
const emit = defineEmits(['input'])

const currentTab = ref('upload')
const { tr } = useI18n()

const tabs = computed(() => {
  return [
    { label: tr('label.upload'), value: 'upload', component: Upload },
    { label: tr('label.link'), value: 'link', component: Link },
  ]
})
</script>

<style lang="scss">
.popover-content:has(.o-media-form) {
  padding: 8px 0 !important;
}

.o-media-form {
  min-width: 500px;

  .tabs {
    display: flex;
    border-bottom: solid 1px var(--yii-border-color);
    padding: 0 16px;

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
  }

  .tab-panels {
    padding: 16px;
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

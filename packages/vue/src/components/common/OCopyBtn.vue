<template>
  <o-common-btn :icon="copyIcon"
                :tooltip="tr('label.copy')" @click="onClick">
  </o-common-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@yiitap/core'

import { OCommonBtn } from '../index'
import { useI18n } from '../../hooks'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['click'])

const { tr } = useI18n()
const copyIcon = ref('content_copy')

function onClick(e: MouseEvent) {
  copyToClipboard(props.text).then(() => {
    copyIcon.value = 'done'
    setTimeout(() => {
      copyIcon.value = 'content_copy'
    }, 2000)
  })
}
</script>

<style lang="scss">
.o-copy-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}
</style>

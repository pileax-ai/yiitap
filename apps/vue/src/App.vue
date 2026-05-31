<template>
  <n-config-provider :theme="theme">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'

const darkMode = ref(false)
const theme = computed(() => {
  return darkMode.value ? darkTheme : null
})

function onMode(value: boolean) {
  darkMode.value = value
}
</script>

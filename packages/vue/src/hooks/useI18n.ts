import { computed, inject, ref } from 'vue'
import { getMessage } from '@yiitap/i18n'

const locale = ref('en')

const message = computed(() => {
  return getMessage(locale.value)
})

const languageName = computed(() => {
  return message.value?.name || 'English'
})

const tr = (key: string) => {
  return key.split('.').reduce((o, i) => {
    if (o) return o[i]
  }, message.value)
}

const setLocale = (inputLang: string) => {
  locale.value = inputLang
}

export default () => {
  const injectLocale = inject('locale', locale)
  if (
    typeof injectLocale === 'object' &&
    injectLocale.value &&
    injectLocale.value !== locale.value
  ) {
    locale.value = injectLocale.value
  }

  return {
    languageName,
    locale,
    message,
    tr,
    setLocale,
  }
}

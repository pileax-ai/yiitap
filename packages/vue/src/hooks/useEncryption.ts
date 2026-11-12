import { shallowReactive } from 'vue'

export const MasterKeys = shallowReactive(new Map<string, CryptoKey>())

export default function () {
  return {}
}

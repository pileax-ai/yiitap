import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { EncryptedBlock, EncryptionMeta, type EncryptedBlockOptions, type EncryptionMetaOptions } from '@yiitap/extension-encrypted'
import View from './view.vue'

const OEncryptedBlock = EncryptedBlock.extend<EncryptedBlockOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export { OEncryptedBlock, EncryptionMeta as OEncryptionMeta }
export type { EncryptedBlockOptions, EncryptionMetaOptions }

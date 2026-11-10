import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { EncryptedBlock, EncryptionMetadata, type EncryptedBlockOptions } from '@yiitap/extension-encrypted'
import View from './view.vue'

const OEncryptedBlock = EncryptedBlock.extend<EncryptedBlockOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export { OEncryptedBlock, EncryptionMetadata as OEncryptionMetadata }
export type { EncryptedBlockOptions }

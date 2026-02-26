import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Blockquote, {
  type BlockquoteOptions as OBlockquoteOptions,
} from '@yiitap/extension-blockquote'

import View from './view.vue'

export const OBlockquote = Blockquote.extend<OBlockquoteOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OBlockquote
export type { OBlockquoteOptions }

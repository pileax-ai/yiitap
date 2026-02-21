import { VueNodeViewRenderer } from '@tiptap/vue-3'
import HorizontalRule, {
  type HorizontalRuleOptions,
} from '@tiptap/extension-horizontal-rule'

import View from './view.vue'

const OHorizontalRule = HorizontalRule.extend<HorizontalRuleOptions>({
  draggable: true,

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OHorizontalRule

export type { HorizontalRuleOptions }

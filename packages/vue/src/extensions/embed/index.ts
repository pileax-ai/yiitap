import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Embed from '@yiitap/extension-embed'

import View from './view.vue'

const OEmbed = Embed.extend({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
}).configure({
  inline: true, // Set true to support alignment
})

export default OEmbed

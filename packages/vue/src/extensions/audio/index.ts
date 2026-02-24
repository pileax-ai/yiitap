import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Audio, { type AudioOptions } from '@tiptap/extension-audio'
import View from './view.vue'

export const OAudio = Audio.extend<AudioOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OAudio

export type { AudioOptions }

import { h } from 'vue'
import { RouterLink } from 'vue-router'

export const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Home',
          },
        },
        { default: () => 'Home' }
      ),
    key: 'home',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'CodeEditor',
          },
        },
        { default: () => 'Code Editor' }
      ),
    key: 'code-editor',
  },
]

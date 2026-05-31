import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Demo from '../pages/Demo.vue'
import CodeEditor from '../pages/CodeEditor.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Demo,
  },
  {
    path: '/code/editor',
    name: 'CodeEditor',
    component: CodeEditor,
  },
]

const router = createRouter({
  history: createWebHistory('/yiitap'),
  routes,
})

export default router

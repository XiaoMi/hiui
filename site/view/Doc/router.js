import Component from './Component'
import Design from './Design'

export default [
  {
    path: '/zh-CN/components',
    component: Component
  },
  {
    path: '/en-US/components',
    component: Component
  },
  {
    path: '/zh-CN/docs/design',
    component: Design
  },
  {
    path: '/en-US/docs/design',
    component: Design
  },
  {
    path: '/zh-CN/',
    strict: true,
    component: Component
  }
]

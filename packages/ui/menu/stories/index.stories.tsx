import React from 'react'
import Menu from '../src'

export * from './basic.stories'
export * from './mini.stories'
export * from './horizontal.stories'
export * from './pop.stories'
export * from './fat.stories'
export * from './vertical-fat.stories'
export * from './expand-all.stories'
export * from './footer-render.stories'
export * from './render.stories'
export * from './size.stories'
export * from './sidebar.stories'

export default {
  title: 'Navigation/Menu',
  component: Menu,
  decorators: [(story: Function) => <div>{story()}</div>],
}

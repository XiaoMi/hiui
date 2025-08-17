import React from 'react'
import Layout from '../src'

export * from './basic.stories'
export * from './float-menu.stories'
export * from './with-menu.stories'

export default {
  title: 'Layout/Layout',
  component: Layout,
  decorators: [(story: Function) => <div>{story()}</div>],
}

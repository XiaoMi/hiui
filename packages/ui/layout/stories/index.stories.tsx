import React from 'react'
import Layout from '../src'

export * from './basic.stories'

export default {
  title: 'Layout/Layout',
  component: Layout,
  decorators: [(story: Function) => <div>{story()}</div>],
}

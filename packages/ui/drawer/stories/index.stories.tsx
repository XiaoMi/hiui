import React from 'react'
import Drawer from '../src'

export * from './basic.stories'
export * from './container.stories'
export * from './extra.stories'
export * from './placement.stories'

export default {
  title: 'FeedBacck/Drawer',
  component: Drawer,
  decorators: [(story: Function) => <div>{story()}</div>],
}

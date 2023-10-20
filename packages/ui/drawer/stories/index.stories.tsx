import React from 'react'
import Drawer from '../src'

export * from './basic.stories'
export * from './header.stories'
export * from './mask.stories'
export * from './outside-click.stories'
export * from './container.stories'
export * from './nested.stories'
export * from './extra.stories'
export * from './placement.stories'

export default {
  title: 'FeedBack/Drawer',
  component: Drawer,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Tabs from '../src'

export * from './basic.stories'
export * from './vertical.stories'
export * from './editable.stories'
export * from './scroll.stories'
export * from './draggable.stories'
export * from './type.stories'
export * from './button.stories'
export * from './desc.stories'
export * from './tab-list.stories'
export * from './extra.stories'
export * from './with-icon.stories'

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Tabs from '../src'

export * from './basic.stories'
export * from './vertical.stories'
export * from './disabled.stories'
export * from './editable.stories'
export * from './edit-render.stories'
export * from './scroll.stories'
export * from './draggable.stories'
export * from './card.stories'
export * from './button.stories'
export * from './desc.stories'
export * from './size.stories'
export * from './tab-list.stories'
export * from './extra.stories'
export * from './with-icon.stories'
export * from './nested.stories'
export * from './unmount-on-inactive.stories'

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
  decorators: [(story: Function) => <div>{story()}</div>],
}

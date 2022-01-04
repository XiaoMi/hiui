import React from 'react'

export * from './basic.stories'
export * from './vertical.stories'
export * from './editable.stories'
export * from './scroll.stories'
export * from './draggable.stories'
export * from './type.stories'
export * from './button.stories'
export * from './desc.stories'
export * from './tab-list.stories'

export default {
  title: 'Navigation/Tabs',
  decorators: [(story: Function) => <div>{story()}</div>],
}

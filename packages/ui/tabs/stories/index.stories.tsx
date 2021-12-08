import React from 'react'

export * from './basic.stories'
export * from './vertical.stories'
export * from './editable.stories'
export * from './scroll.stories'
export * from './draggable.stories'
export * from './type.stories'

export default {
  title: 'Tabs',
  decorators: [(story: Function) => <div>{story()}</div>],
}

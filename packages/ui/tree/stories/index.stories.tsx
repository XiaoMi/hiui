import React from 'react'

export * from './basic.stories'
export * from './draggable.stories'
export * from './dynamic.stories'
export * from './checkable.stories'
export * from './virtual-list.stories'
export * from './editable.stories'
export * from './search.stories'
export * from './expand.stories'
export * from './custom-title.stories'
export * from './custom-icon.stories'
export * from './action.stories'

export default {
  title: 'Tree',
  decorators: [(story: Function) => <div>{story()}</div>],
}

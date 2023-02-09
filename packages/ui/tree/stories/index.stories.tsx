import React from 'react'
import Tree from '../src'

export * from './basic.stories'
export * from './draggable.stories'
export * from './dynamic.stories'
export * from './checkable.stories'
export * from './expand.stories'
export * from './virtual-list.stories'
export * from './editable.stories'
export * from './search.stories'
export * from './custom-search.stories'
export * from './custom-title.stories'
export * from './custom-icon.stories'
export * from './expand-on-click.stories'

export default {
  title: 'Data Display/Tree',
  component: Tree,
  decorators: [(story: Function) => <div>{story()}</div>],
}

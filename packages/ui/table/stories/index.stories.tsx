import React from 'react'

export * from './basic.stories'
export * from './highlight.stories'
export * from './striped.stories'
export * from './draggable.stories'
export * from './pagination.stories'
export * from './row-selection.stories'
export * from './table-tree.stories'
export * from './expanded-render.stories'

export default {
  title: 'Table',
  decorators: [(story: Function) => <div>{story()}</div>],
}

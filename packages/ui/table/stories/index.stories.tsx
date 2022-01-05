import React from 'react'
import Table from '../src'

export * from './basic.stories'
export * from './frozen.stories'
export * from './resizable.stories'
export * from './highlight.stories'
export * from './striped.stories'
export * from './draggable.stories'
export * from './group-header.stories'
export * from './fixed-header.stories'
export * from './sticky-header.stories'
export * from './table-tree.stories'
export * from './expanded-render.stories'
export * from './row-selection.stories'
export * from './merged-cell.stories'
export * from './pagination.stories'
export * from './hidden-cols.stories'
export * from './loading.stories'

export default {
  title: 'Data Display/Table',
  component: Table,
  decorators: [(story: Function) => <div>{story()}</div>],
}

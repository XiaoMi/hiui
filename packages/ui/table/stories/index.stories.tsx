import React from 'react'
import Table from '../src'

export * from './basic.stories'
export * from './width.stories'
export * from './field-key.stories'
export * from './frozen.stories'
export * from './calc.stories'
export * from './col-menu.stories'
export * from './data-sorter.stories'
export * from './custom-filter.stories'
export * from './resizable.stories'
export * from './max-height.stories'
export * from './highlight.stories'
export * from './highlight-rows.stories'
export * from './highlight-cols.stories'
export * from './striped.stories'
export * from './bordered.stories'
export * from './size.stories'
export * from './draggable.stories'
export * from './group-header.stories'
export * from './fixed-header.stories'
export * from './sticky-header.stories'
export * from './sticky-footer.stories'
export * from './table-tree.stories'
export * from './on-load-children.stories'
export * from './expanded-render.stories'
export * from './async-expanded-render.stories'
export * from './row-selection.stories'
export * from './footer-render.stories'
export * from './merged-cell.stories'
export * from './pagination.stories'
export * from './data-source.stories'
export * from './setting.stories'
export * from './setting-drawer.stories'
export * from './scrollbar.stories'
export * from './loading.stories'
export * from './empty.stories'
export * from './virtual.stories'

export default {
  title: 'Data Display/Table',
  component: Table,
  decorators: [(story: Function) => <div>{story()}</div>],
}

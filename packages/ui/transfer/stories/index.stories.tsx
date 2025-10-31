import React from 'react'
import Transfer from '../src'

export * from './basic.stories'
export * from './title.stories'
export * from './limit.stories'
export * from './multiple.stories'
export * from './disabled.stories'
export * from './all-check.stories'
export * from './searchable.stories'
export * from './pagination.stories'
export * from './draggable.stories'
export * from './render.stories'
export * from './fast-transfer.stories'

export default {
  title: 'Data Input/Transfer',
  component: Transfer,
  decorators: [(story: Function) => <div>{story()}</div>],
}

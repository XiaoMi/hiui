import React from 'react'

export * from './basic.stories'
export * from './title.stories'
export * from './limit.stories'
export * from './multiple.stories'
export * from './disabled.stories'
export * from './all-check.stories'
export * from './searchable.stories'
export * from './pagination.stories'

export default {
  title: 'Transfer',
  decorators: [(story: Function) => <div>{story()}</div>],
}

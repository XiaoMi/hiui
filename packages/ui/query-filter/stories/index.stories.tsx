import React from 'react'
import QueryFilter from '../src'

export * from './basic.stories'
export * from './with-search.stories'
export * from './with-reset.stories'
export * from './all-filter.stories'

export default {
  title: 'Data Input/QueryFilter',
  component: QueryFilter,
  decorators: [(story: Function) => <div>{story()}</div>],
}

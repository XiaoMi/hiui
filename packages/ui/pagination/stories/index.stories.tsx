import React from 'react'
import Pagination from '../src'

export * from './basic.stories'
export * from './page-size-options.stories'
export * from './simple.stories'
export * from './mini-input.stories'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  decorators: [(story: Function) => <div>{story()}</div>],
}

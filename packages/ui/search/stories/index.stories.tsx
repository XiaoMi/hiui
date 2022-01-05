import React from 'react'
import Search from '../src'

export * from './basic.stories'
export * from './data.stories'

export default {
  title: 'Data Input/Search',
  component: Search,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Search from '../src'

export * from './basic.stories'
export * from './data.stories'
export * from './async.stories'
export * from './size.stories'
export * from './addon.stories'
export * from './appearance.stories'
export * from './classify.stories'

export default {
  title: 'Data Input/Search',
  component: Search,
  decorators: [(story: Function) => <div>{story()}</div>],
}

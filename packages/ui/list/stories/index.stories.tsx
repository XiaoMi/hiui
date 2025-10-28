import React from 'react'
import List from '../src'

export * from './basic.stories'
export * from './no-split.stories'
export * from './action.stories'
export * from './pagination.stories'
export * from './empty.stories'
// export * from './border.stories'
export * from './avatar.stories'

export default {
  title: 'Data Display/List',
  component: List,
  decorators: [(story: Function) => <div>{story()}</div>],
}

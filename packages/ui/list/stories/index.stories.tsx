import React from 'react'

export * from './basic.stories'
export * from './pagination.stories'
export * from './no-split.stories'
export * from './action.stories'

export default {
  title: 'Data Display/List',
  decorators: [(story: Function) => <div>{story()}</div>],
}

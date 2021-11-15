import React from 'react'

export * from './basic.stories'
export * from './indeterminate.stories'
export * from './circle.stories'
export * from './dashboard.stories'

export default {
  title: 'Progress',
  decorators: [(story: Function) => <div>{story()}</div>],
}

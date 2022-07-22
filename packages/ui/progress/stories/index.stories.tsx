import React from 'react'
import Progress from '../src'

export * from './basic.stories'
export * from './circle.stories'
export * from './dashboard.stories'
export * from './custom-percent.stories'
export * from './indeterminate.stories'
export * from './inside.stories'
export * from './bar-size.stories'
export * from './circle-size.stories'
export * from './dashboard-size.stories'

export default {
  title: 'FeedBack/Progress',
  component: Progress,
  decorators: [(story: Function) => <div>{story()}</div>],
}

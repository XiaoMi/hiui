import React from 'react'
import EmptyState from '../src'

export * from './basic.stories'
export * from './size.stories'
export * from './with-content.stories'
export * from './custom.stories'
export * from './colorful.stories'

export default {
  title: 'FeedBack/EmptyState',
  component: EmptyState,
  decorators: [(story: Function) => <div>{story()}</div>],
}

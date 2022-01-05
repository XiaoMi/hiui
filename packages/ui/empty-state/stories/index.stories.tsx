import React from 'react'
import EmptyState from '../src'

export * from './basic.stories'

export default {
  title: 'FeedBacck/EmptyState',
  component: EmptyState,
  decorators: [(story: Function) => <div>{story()}</div>],
}

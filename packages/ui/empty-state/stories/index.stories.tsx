import React from 'react'

export * from './basic.stories'

export default {
  title: 'FeedBacck/EmptyState',
  decorators: [(story: Function) => <div>{story()}</div>],
}

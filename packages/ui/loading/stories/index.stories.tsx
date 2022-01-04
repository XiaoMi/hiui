import React from 'react'

export * from './basic.stories'

export default {
  title: 'FeedBacck/Loading',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './custom.stories'
export * from './complete.stories'

export default {
  title: 'FeedBacck/Result',
  decorators: [(story: Function) => <div>{story()}</div>],
}

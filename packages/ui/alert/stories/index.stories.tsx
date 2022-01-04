import React from 'react'

export * from './basic.stories'
export * from './content.stories'
export * from './closable.stories'

export default {
  title: 'FeedBacck/Alert',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './tag-group.stories'

export default {
  title: 'FeedBacck/Tag',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Tag from '../src'

export * from './basic.stories'
export * from './tag-group.stories'

export default {
  title: 'FeedBacck/Tag',
  component: Tag,
  decorators: [(story: Function) => <div>{story()}</div>],
}

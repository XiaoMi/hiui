import React from 'react'
import Message from '../src'

export * from './basic.stories'
export * from './close.stories'
export * from './auto-close.stories'

export default {
  title: 'FeedBacck/Message',
  component: Message,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Message from '../src'

export * from './basic.stories'
export * from './type.stories'
export * from './close.stories'
export * from './auto-close.stories'

export default {
  title: 'FeedBack/Message',
  component: Message,
  decorators: [(story: Function) => <div>{story()}</div>],
}

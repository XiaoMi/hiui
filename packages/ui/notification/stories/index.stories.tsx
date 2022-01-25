import React from 'react'
import Notification from '../src'

export * from './basic.stories'
export * from './close.stories'
export * from './auto-close.stories'
export * from './action.stories'

export default {
  title: 'FeedBacck/Notification',
  component: Notification,
  decorators: [(story: Function) => <div>{story()}</div>],
}

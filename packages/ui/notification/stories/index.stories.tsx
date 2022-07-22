import React from 'react'
import Notification from '../src'

export * from './basic.stories'
export * from './close.stories'
export * from './title.stories'
export * from './auto-close.stories'
export * from './action.stories'

export default {
  title: 'FeedBack/Notification',
  component: Notification,
  decorators: [(story: Function) => <div>{story()}</div>],
}

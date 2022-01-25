import React from 'react'
import Loading from '../src'

export * from './basic.stories'
export * from './duration.stories'
export * from './visible.stories'

export default {
  title: 'FeedBacck/Loading',
  component: Loading,
  decorators: [(story: Function) => <div>{story()}</div>],
}

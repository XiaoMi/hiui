import React from 'react'
import Badge from '../src'

export * from './basic.stories'
export * from './custom.stories'
export * from './bubble.stories'
export * from './max.stories'
export * from './independent.stories'
export * from './offset.stories'
export * from './color.stories'

export default {
  title: 'FeedBack/Badge',
  component: Badge,
  decorators: [(story: Function) => <div>{story()}</div>],
}

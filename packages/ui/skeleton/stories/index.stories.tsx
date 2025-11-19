import React from 'react'
import Skeleton from '../src'

export * from './basic.stories'
export * from './usage.stories'
export * from './type.stories'
export * from './animation.stories'
export * from './size.stories'
export * from './widthAndHeight.stories'

export * from './group.stories'

export default {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  decorators: [(story: Function) => <div>{story()}</div>],
}

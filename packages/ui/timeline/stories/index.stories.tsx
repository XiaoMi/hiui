import React from 'react'

export * from './basic.stories'
export * from './right.stories'
export * from './cross.stories'
export * from './group.stories'

export default {
  title: 'Timeline',
  decorators: [(story: Function) => <div>{story()}</div>],
}

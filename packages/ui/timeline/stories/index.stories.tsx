import React from 'react'
import Timeline from '../src'

export * from './basic.stories'
export * from './right.stories'
export * from './cross.stories'
export * from './group.stories'
export * from './card.stories'
export * from './custom-icon.stories'

export default {
  title: 'Data Display/Timeline',
  component: Timeline,
  decorators: [(story: Function) => <div>{story()}</div>],
}

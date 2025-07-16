import React from 'react'
import Timeline from '../src'

export * from './basic.stories'
export * from './right.stories'
export * from './cross.stories'
export * from './color.stories'
export * from './group.stories'
export * from './card-content.stories'
export * from './custom-icon.stories'
export * from './placement.stories'

export default {
  title: 'Data Display/Timeline',
  component: Timeline,
  decorators: [(story: Function) => <div>{story()}</div>],
}

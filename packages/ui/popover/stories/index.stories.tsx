import React from 'react'
import Popover from '../src'

export * from './basic.stories'
export * from './arrow.stories'
export * from './trigger.stories'
export * from './placement.stories'
export * from './controlled.stories'
export * from './gutter-gap.stories'

export default {
  title: 'Data Display/Popover',
  component: Popover,
  decorators: [(story: Function) => <div>{story()}</div>],
}

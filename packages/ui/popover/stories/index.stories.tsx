import React from 'react'
import Popover from '../src'

export * from './basic.stories'
export * from './controlled.stories'

export default {
  title: 'Data Display/Popover',
  component: Popover,
  decorators: [(story: Function) => <div>{story()}</div>],
}

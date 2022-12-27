import React from 'react'
import Tooltip from '../src'

export * from './basic.stories'
export * from './trigger.stories'
export * from './placement.stories'
export * from './break-word.stories'
export * from './with-api.stories'
export * from './gutter-gap.stories'

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  decorators: [(story: Function) => <div>{story()}</div>],
}

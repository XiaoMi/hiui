import React from 'react'
import EllipsisTooltip from '../src'

export * from './basic.stories'
export * from './multiply-line.stories'
export * from './max-text-count.stories'

export default {
  title: 'Data Display/EllipsisTooltip',
  component: EllipsisTooltip,
  decorators: [(story: Function) => <div>{story()}</div>],
}

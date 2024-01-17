import React from 'react'
import ResizeBox from '../src'

export * from './basic.stories'
export * from './min-width.stories'
export * from './collapsible.stories'

export default {
  title: 'Others/ResizeBox',
  component: ResizeBox,
  decorators: [(story: Function) => <div>{story()}</div>],
}

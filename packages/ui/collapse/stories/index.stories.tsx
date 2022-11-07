import React from 'react'
import Collapse from '../src'

export * from './basic.stories'
export * from './accordion.stories'
export * from './arrow-placement.stories'
export * from './no-border.stories'
export * from './arrow-render.stories'
export * from './size.stories'

export default {
  title: 'Data Display/Collapse',
  component: Collapse,
  decorators: [(story: Function) => <div>{story()}</div>],
}

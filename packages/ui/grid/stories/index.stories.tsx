import React from 'react'
import Grid from '../src'

export * from './basic.stories'
export * from './gutter.stories'
export * from './offset.stories'
export * from './nested.stories'
export * from './justify.stories'
export * from './responsive.stories'
export * from './order.stories'

export default {
  title: 'Basic/Grid',
  component: Grid,
  decorators: [(story: Function) => <div>{story()}</div>],
}

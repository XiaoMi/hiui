import React from 'react'
import Divider from '../src'

export * from './basic.stories'
export * from './color.stories'
export * from './style.stories'
export * from './dashed.stories'
export * from './vertical.stories'
export * from './children.stories'
export default {
  title: 'Basic/Divider',
  component: Divider,
  decorators: [(story: Function) => <div>{story()}</div>],
}

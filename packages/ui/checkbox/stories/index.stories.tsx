import React from 'react'
import Checkbox from '../src'

export * from './basic.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './placement.stories'
export * from './check-all.stories'
export * from './children.stories'

export default {
  title: 'Data Input/Checkbox',
  component: Checkbox,
  decorators: [(story: Function) => <div>{story()}</div>],
}

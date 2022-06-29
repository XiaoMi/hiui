import React from 'react'
import Radio from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './placement.stories'
export * from './children.stories'
export * from './button.stories'

export default {
  title: 'Data Input/Radio',
  component: Radio,
  decorators: [(story: Function) => <div>{story()}</div>],
}

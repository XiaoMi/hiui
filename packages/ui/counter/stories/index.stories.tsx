import React from 'react'
import Counter from '../src'

export * from './basic.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './controlled.stories'
export * from './auto-focus.stories'
export * from './step.stories'
export * from './Wheel.stories'

export default {
  title: 'Data Input/Counter',
  component: Counter,
  decorators: [(story: Function) => <div>{story()}</div>],
}

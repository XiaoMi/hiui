import React from 'react'
import NumberInput from '../src'

export * from './basic.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './controlled.stories'
export * from './step.stories'
export * from './Wheel.stories'
export * from './invalid.stories'
export * from './formatter.stories'

export default {
  title: 'Data Input/NumberInput',
  component: NumberInput,
  decorators: [(story: Function) => <div>{story()}</div>],
}

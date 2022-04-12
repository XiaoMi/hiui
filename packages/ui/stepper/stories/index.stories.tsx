import React from 'react'
import Stepper from '../src'

export * from './basic.stories'
export * from './item-layout.stories'
export * from './placement.stories'
export * from './dot.stories'

export default {
  title: 'Navigation/Stepper',
  component: Stepper,
  decorators: [(story: Function) => <div>{story()}</div>],
}

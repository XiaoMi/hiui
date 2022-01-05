import React from 'react'
import Stepper from '../src'

export * from './basic.stories'
export * from './vertical.story'
export * from './vertical-layout.story'

export default {
  title: 'Navigation/Stepper',
  component: Stepper,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'
export * from './step.stories'
export * from './Wheel.stories'

export default {
  title: 'Counter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

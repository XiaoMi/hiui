import React from 'react'
import Slider from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './reversed.stories'
export * from './vertical.stories'
export * from './range.stories'
export * from './disabled.stories'
export * from './tip.stories'
export * from './custom-color.stories'
export * from './mark.stories'

export default {
  title: 'Data Input/Slider',
  component: Slider,
  decorators: [(story: Function) => <div>{story()}</div>],
}

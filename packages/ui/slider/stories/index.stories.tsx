import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'
export * from './range.stories'
export * from './disabled.stories'
export * from './vertical.stories'
export * from './tip.stories'
export * from './custom-color.stories'
export * from './mark.stories'

export default {
  title: 'Slider',
  decorators: [(story: Function) => <div>{story()}</div>],
}

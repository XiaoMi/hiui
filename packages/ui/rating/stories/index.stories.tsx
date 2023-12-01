import React from 'react'
import Rating from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './size.stories'
export * from './character.stories'
export * from './half.stories'
export * from './clearable.stories'
export * from './count.stories'
export * from './status.stories'
export * from './tooltip.stories'
export * from './emoji.stories'
export * from './custom.stories'
export * from './desc.stories'

export default {
  title: 'Data Input/Rating',
  component: Rating,
  decorators: [(story: Function) => <div>{story()}</div>],
}

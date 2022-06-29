import React from 'react'
import Input from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './addon.stories'
export * from './group.stories'
export * from './clearable.stories'
export * from './invalid.stories'
export * from './disabled.stories'
export * from './auto-focus.stories'
export * from './focus.stories'
export * from './trim.stories'
export * from './format.stories'
export * from './with-tooltip.stories'
// export * from './mock.stories'

export default {
  title: 'Data Input/Input',
  component: Input,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Input from '../src'

export * from './basic.stories'
export * from './disabled.stories'
export * from './invalid.stories'
export * from './addon.stories'
export * from './group.stories'
export * from './appearance.stories'
export * from './clearable.stories'
export * from './focus.stories'
export * from './size.stories'
export * from './type.stories'
export * from './controlled.stories'
export * from './trim.stories'
export * from './textarea.stories'
export * from './mock.stories'

export default {
  title: 'Data Input/Input',
  component: Input,
  decorators: [(story: Function) => <div>{story()}</div>],
}

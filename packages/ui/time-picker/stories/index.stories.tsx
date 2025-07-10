import React from 'react'
import TimePicker from '../src'

export * from './basic.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './input-readonly.stories'
export * from './disabled.stories'
export * from './range.stories'
export * from './format.stories'
export * from './custom-disabled.stories'
export * from './addon.stories'

export default {
  title: 'Data Input/TimePicker',
  component: TimePicker,
  decorators: [(story: Function) => <div>{story()}</div>],
}

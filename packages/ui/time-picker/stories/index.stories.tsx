import React from 'react'
import TimePicker from '../src'

export * from './basic.stories'
export * from './custom-disabled.stories'
export * from './format.stories'

export default {
  title: 'Data Input/TimePicker',
  component: TimePicker,
  decorators: [(story: Function) => <div>{story()}</div>],
}

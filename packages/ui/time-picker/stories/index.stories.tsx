import React from 'react'

export * from './basic.stories'
export * from './custom-disabled.stories'
export * from './format.stories'

export default {
  title: 'Data Input/TimePicker',
  decorators: [(story: Function) => <div>{story()}</div>],
}

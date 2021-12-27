import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'
export * from './uncontrolled.stories'
export * from './clearable.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './search.stories'

export default {
  title: 'Select',
  decorators: [(story: Function) => <div>{story()}</div>],
}

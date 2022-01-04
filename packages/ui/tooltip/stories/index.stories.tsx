import React from 'react'

export * from './basic.stories'
export * from './trigger.stories'
export * from './placement.stories'
export * from './break-word.stories'
export * from './with-api.stories'

export default {
  title: 'Data Display/Tooltip',
  decorators: [(story: Function) => <div>{story()}</div>],
}

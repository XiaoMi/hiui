import React from 'react'

export * from './basic.stories'
export * from './trigger.stories'
export * from './break-word.stories'

export default {
  title: 'Tooltip',
  decorators: [(story: Function) => <div>{story()}</div>],
}

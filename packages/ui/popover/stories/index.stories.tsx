import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'

export default {
  title: 'Popover',
  decorators: [(story: Function) => <div>{story()}</div>],
}

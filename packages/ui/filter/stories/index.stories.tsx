import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'

export default {
  title: 'Filter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

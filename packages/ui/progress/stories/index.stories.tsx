import React from 'react'

export * from './basic.stories'
export * from './indeterminate.stories'

export default {
  title: 'Progress',
  decorators: [(story: Function) => <div>{story()}</div>],
}

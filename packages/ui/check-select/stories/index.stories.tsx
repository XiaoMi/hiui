import React from 'react'

export * from './basic.stories'
export * from './disabled.stories'
export * from './search.stories'
export * from './virtual-list.stories'

export default {
  title: 'CheckSelect',
  decorators: [(story: Function) => <div>{story()}</div>],
}

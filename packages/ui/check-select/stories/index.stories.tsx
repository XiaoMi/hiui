import React from 'react'

export * from './basic.stories'
export * from './search.stories'

export default {
  title: 'CheckSelect',
  decorators: [(story: Function) => <div>{story()}</div>],
}

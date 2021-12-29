import React from 'react'

export * from './basic.stories'
export * from './data.stories'

export default {
  title: 'Search',
  decorators: [(story: Function) => <div>{story()}</div>],
}

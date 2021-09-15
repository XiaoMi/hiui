import React from 'react'

export * from './basic.stories'
export * from './search.stories'

export default {
  title: 'Select',
  decorators: [(story: Function) => <div>{story()}</div>],
}

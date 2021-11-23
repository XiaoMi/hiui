import React from 'react'

export * from './basic.stories'
export * from './nested.stories'

export default {
  title: 'Modal',
  decorators: [(story: Function) => <div>{story()}</div>],
}

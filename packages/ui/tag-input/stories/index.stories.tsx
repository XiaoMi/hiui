import React from 'react'

export * from './basic.stories'
export * from './mock.stories'

export default {
  title: 'TagInput',
  decorators: [(story: Function) => <div>{story()}</div>],
}

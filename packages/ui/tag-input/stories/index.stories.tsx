import React from 'react'

export * from './basic.stories'
export * from './mock.stories'
export * from './wrap.stories'

export default {
  title: 'Private/TagInput',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import TagInput from '../src'

export * from './basic.stories'
export * from './mock.stories'
export * from './wrap.stories'

export default {
  title: 'Private/TagInput',
  component: TagInput,
  decorators: [(story: Function) => <div>{story()}</div>],
}

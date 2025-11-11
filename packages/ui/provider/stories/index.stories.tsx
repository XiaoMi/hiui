import React from 'react'

export * from './basic.stories'
export * from './portal.stories'
export * from './locale-methods.stories'

export default {
  title: 'Provider',
  decorators: [(story: Function) => <div>{story()}</div>],
}

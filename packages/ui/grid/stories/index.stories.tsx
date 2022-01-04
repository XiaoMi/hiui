import React from 'react'

export * from './basic.stories'
export * from './gutter.stories'
export * from './offset.stories'
export * from './nested.stories'
export * from './justify.stories'

export default {
  title: 'Basic/Grid',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './closeable.stories'
export * from './nested.stories'
export * from './size.stories'
export * from './scroll.stories'
export * from './lock-scroll.stories'

export default {
  title: 'Modal',
  decorators: [(story: Function) => <div>{story()}</div>],
}

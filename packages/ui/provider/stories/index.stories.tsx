import React from 'react'

export * from './basic.stories'
export * from './theme.stories'
export * from './custom-prefix-cls.stories'
export * from './portal.stories'
export * from './size.stories'
export * from './locale-extends.stories'
export * from './locale-merge.stories'

export default {
  title: 'Provider',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './direction.stories'
export * from './align.stories'
export * from './size.stories'
export * from './auto-size.stories'
export * from './split.stories'

export default {
  title: 'Basic/Space',
  decorators: [(story: Function) => <div>{story()}</div>],
}

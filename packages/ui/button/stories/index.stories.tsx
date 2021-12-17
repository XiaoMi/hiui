import React from 'react'

export * from './status.stories'
export * from './line.stories'
export * from './link.stories'
export * from './size.stories'
export * from './icon.stories'
export * from './loading.stories'
export * from './disabled.stories'

export default {
  title: 'Button',
  decorators: [(story: Function) => <div>{story()}</div>],
}

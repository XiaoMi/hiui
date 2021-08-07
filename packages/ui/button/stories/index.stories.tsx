import React from 'react'

export * from './flat.stories'
export * from './line.stories'
export * from './link.stories'

export default {
  title: 'Button',
  decorators: [(story: Function) => <div>{story()}</div>],
}

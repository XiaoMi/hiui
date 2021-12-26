import React from 'react'

export * from './basic.stories'
export * from './density.stories'
export * from './container.stories'

export default {
  title: 'Watermark',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './no-header.stories'
export * from './hoverable.stories'
export * from './img.stories'

export default {
  title: 'Card',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './highlight.stories'
export * from './striped.stories'

export default {
  title: 'Table',
  decorators: [(story: Function) => <div>{story()}</div>],
}

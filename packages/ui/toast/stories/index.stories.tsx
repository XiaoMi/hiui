import React from 'react'

export * from './basic.stories'
export * from './close.stories'

export default {
  title: 'Toast',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './horizontal.stories'

export default {
  title: 'Menu',
  decorators: [(story: Function) => <div>{story()}</div>],
}

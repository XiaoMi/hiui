import React from 'react'

export * from './basic.stories'
export * from './horizontal.stories'
export * from './pop.stories'
export * from './fat.stories'
export * from './vertical-fat.stories'

export default {
  title: 'Menu',
  decorators: [(story: Function) => <div>{story()}</div>],
}

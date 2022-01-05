import React from 'react'
import Menu from '../src'

export * from './basic.stories'
export * from './horizontal.stories'
export * from './pop.stories'
export * from './fat.stories'
export * from './vertical-fat.stories'

export default {
  title: 'Navigation/Menu',
  component: Menu,
  decorators: [(story: Function) => <div>{story()}</div>],
}

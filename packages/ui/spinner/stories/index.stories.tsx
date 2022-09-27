import React from 'react'
import Spinner from '../src'

export * from './basic.stories'
export * from './size.stories'
export * from './children.stories'
export * from './icon.stories'
export * from './content.stories'
export * from './visible.stories'
export * from './delay.stories'

export default {
  title: 'Private（暂不对外）/Spinner',
  component: Spinner,
  decorators: [(story: Function) => <div>{story()}</div>],
}

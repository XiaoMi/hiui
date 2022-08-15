import React from 'react'
import Anchor from '../src'

export * from './basic.stories'
export * from './children.stories'

export default {
  title: 'Anchor',
  component: Anchor,
  decorators: [(story: Function) => <div>{story()}</div>],
}

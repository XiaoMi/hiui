import React from 'react'
import Anchor from '../src'

export * from './basic.stories'
export * from './children.stories'
export * from './overflow.stories'
export * from './offset.stories'

export default {
  title: 'Others/Anchor',
  component: Anchor,
  decorators: [(story: Function) => <div>{story()}</div>],
}

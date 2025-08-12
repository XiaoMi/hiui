import React from 'react'
import Button from '../src'

export * from './basic.stories'
export * from './line.stories'
export * from './link.stories'
export * from './text.stories'
export * from './size.stories'
export * from './icon.stories'
export * from './icon-link.stories'
export * from './loading.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './shape.stories'

export default {
  title: 'Basic/Button',
  component: Button,
  decorators: [(story: Function) => <div>{story()}</div>],
}

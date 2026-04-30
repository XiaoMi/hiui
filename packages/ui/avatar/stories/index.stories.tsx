import React from 'react'
import Avatar from '../src'

export * from './basic.stories'
export * from './content.stories'
export * from './shape.stories'
export * from './size.stories'
export * from './custom-size.stories'
export * from './custom-color.stories'
export * from './group.stories'

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
  decorators: [(story: Function) => <div>{story()}</div>],
}

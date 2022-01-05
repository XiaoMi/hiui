import React from 'react'
import Avatar from '../src'

export * from './basic.stories'
export * from './shape.stories'
export * from './size.stories'

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './shape.stories'
export * from './size.stories'

export default {
  title: 'Data Display/Avatar',
  decorators: [(story: Function) => <div>{story()}</div>],
}

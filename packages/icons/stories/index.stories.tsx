import React from 'react'

export * from './basic.stories'
export * from './alert.stories'
export * from './direction.stories'
export * from './edit.stories'
export * from './file.stories'
export * from './data.stories'

export default {
  title: 'Icons',
  decorators: [(story: Function) => <div>{story()}</div>],
}

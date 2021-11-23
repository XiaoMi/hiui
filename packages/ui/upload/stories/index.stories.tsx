import React from 'react'

export * from './basic.stories'
export * from './draggable.stories'

export default {
  title: 'Upload',
  decorators: [(story: Function) => <div>{story()}</div>],
}

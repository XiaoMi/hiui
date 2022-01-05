import React from 'react'
import Upload from '../src'

export * from './basic.stories'
export * from './draggable.stories'
export * from './picture-list.stories'
export * from './picture.stories'
export * from './avatar.stories'

export default {
  title: 'Data Input/Upload',
  component: Upload,
  decorators: [(story: Function) => <div>{story()}</div>],
}

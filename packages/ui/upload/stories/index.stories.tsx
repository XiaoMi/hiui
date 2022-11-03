import React from 'react'
import Upload from '../src'

export * from './basic.stories'
export * from './draggable.stories'
export * from './picture-card.stories'
export * from './photo.stories'
export * from './avatar.stories'
export * from './custom-upload.stories'
export * from './action-render.stories'
export * from './custom-request.stories'

export default {
  title: 'Data Input/Upload',
  component: Upload,
  decorators: [(story: Function) => <div>{story()}</div>],
}

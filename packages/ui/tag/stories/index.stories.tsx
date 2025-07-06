import React from 'react'
import Tag from '../src'

export * from './basic.stories'
export * from './appearance.stories'
export * from './shape.stories'
export * from './size.stories'
export * from './closeable.stories'
export * from './editable.stories'
export * from './colors.stories'
export * from './custom-color.stories'
export * from './max-width.stories'
export * from './tag-group.stories'
export * from './editor-render.stories'
export * from './trigger-edit.stories'

export default {
  title: 'FeedBack/Tag',
  component: Tag,
  decorators: [(story: Function) => <div>{story()}</div>],
}

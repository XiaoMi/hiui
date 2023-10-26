import React from 'react'
import TextArea from '@hi-ui/textarea'

export * from './basic.stories'
export * from './auto-size.stories'
export * from './show-count.stories'
export * from './disabled.stories'
export * from './header.stories'

export default {
  title: 'Data Input/Textarea',
  component: TextArea,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './auto-size.stories'
export * from './show-count.stories'

export default {
  title: 'Data Input/Textarea',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'Data Input/Textarea',
  decorators: [(story: Function) => <div>{story()}</div>],
}

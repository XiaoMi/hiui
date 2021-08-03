import React from 'react'

export * from './basic.stories'

export default {
  title: 'Input',
  decorators: [(story: Function) => <div>{story()}</div>],
}

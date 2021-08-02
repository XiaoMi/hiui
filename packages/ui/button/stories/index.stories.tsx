import React from 'react'

export * from './basic.stories'

export default {
  title: 'Button',
  decorators: [(story: Function) => <div>{story()}</div>],
}

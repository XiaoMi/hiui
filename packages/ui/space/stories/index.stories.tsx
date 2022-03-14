import React from 'react'

export * from './basic.stories'

export default {
  title: 'Space',
  decorators: [(story: Function) => <div>{story()}</div>],
}

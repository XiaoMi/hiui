import React from 'react'

export * from './basic.stories'

export default {
  title: 'Tree',
  decorators: [(story: Function) => <div>{story()}</div>],
}

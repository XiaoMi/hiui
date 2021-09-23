import React from 'react'

export * from './basic.stories'

export default {
  title: 'Toast',
  decorators: [(story: Function) => <div>{story()}</div>],
}

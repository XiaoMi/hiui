import React from 'react'

export * from './basic.stories'

export default {
  title: 'Filter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

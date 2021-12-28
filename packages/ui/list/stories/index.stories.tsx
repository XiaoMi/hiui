import React from 'react'

export * from './basic.stories'

export default {
  title: 'List',
  decorators: [(story: Function) => <div>{story()}</div>],
}

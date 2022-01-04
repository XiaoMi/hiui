import React from 'react'

export * from './basic.stories'

export default {
  title: 'Private/IconButton',
  decorators: [(story: Function) => <div>{story()}</div>],
}

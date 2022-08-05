import React from 'react'

export * from './basic.stories'
export * from './group.stories'

export default {
  title: 'Data Input/InputGroup',
  decorators: [(story: Function) => <div>{story()}</div>],
}

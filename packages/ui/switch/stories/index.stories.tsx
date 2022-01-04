import React from 'react'

export * from './basic.stories'
export * from './custom.stories'

export default {
  title: 'Data Input/Switch',
  decorators: [(story: Function) => <div>{story()}</div>],
}

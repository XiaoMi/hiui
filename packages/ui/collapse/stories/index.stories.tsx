import React from 'react'

export * from './basic.stories'

export default {
  title: 'Collapse',
  decorators: [(story: Function) => <div>{story()}</div>],
}

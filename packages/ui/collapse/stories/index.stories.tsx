import React from 'react'

export * from './basic.stories'

export default {
  title: 'Data Display/Collapse',
  decorators: [(story: Function) => <div>{story()}</div>],
}

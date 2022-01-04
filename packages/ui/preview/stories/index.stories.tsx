import React from 'react'

export * from './basic.stories'

export default {
  title: 'Data Display/Preview',
  decorators: [(story: Function) => <div>{story()}</div>],
}

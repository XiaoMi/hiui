import React from 'react'

export * from './basic.stories'

export default {
  title: 'Data Input/Rating',
  decorators: [(story: Function) => <div>{story()}</div>],
}

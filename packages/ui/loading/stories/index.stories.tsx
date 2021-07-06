import React from 'react'

export * from './basic.stories'

export default {
  title: 'Loading',
  decorators: [(story: Function) => <div>{story()}</div>],
}

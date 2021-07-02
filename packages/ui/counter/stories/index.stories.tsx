import React from 'react'

export * from './basic.stories'

export default {
  title: 'Counter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

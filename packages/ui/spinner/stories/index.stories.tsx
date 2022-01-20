import React from 'react'

export * from './basic.stories'

export default {
  title: 'Private/Spinner',
  decorators: [(story: Function) => <div>{story()}</div>],
}

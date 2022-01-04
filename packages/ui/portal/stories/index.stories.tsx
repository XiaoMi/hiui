import React from 'react'

export * from './basic.stories'

export default {
  title: 'Private/Portal',
  decorators: [(story: Function) => <div>{story()}</div>],
}

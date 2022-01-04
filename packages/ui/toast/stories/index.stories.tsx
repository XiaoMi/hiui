import React from 'react'

export * from './basic.stories'

export default {
  title: 'Private/Toast',
  decorators: [(story: Function) => <div>{story()}</div>],
}

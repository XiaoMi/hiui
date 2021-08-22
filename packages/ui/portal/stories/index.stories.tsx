import React from 'react'

export * from './basic.stories'

export default {
  title: 'Portal',
  decorators: [(story: Function) => <div>{story()}</div>],
}

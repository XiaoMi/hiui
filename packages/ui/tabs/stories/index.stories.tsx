import React from 'react'

export * from './basic.stories'

export default {
  title: 'Tabs',
  decorators: [(story: Function) => <div>{story()}</div>],
}

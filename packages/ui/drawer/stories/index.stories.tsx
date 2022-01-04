import React from 'react'

export * from './basic.stories'
export * from './container.stories'
export * from './extra.stories'
export * from './placement.stories'

export default {
  title: 'FeedBacck/Drawer',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './axes.stories'
export * from './config.stories'
export * from './event.stories'

export default {
  title: 'Scrollbar',
  decorators: [(story: Function) => <div>{story()}</div>],
}

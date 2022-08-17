import React from 'react'
import Scrollbar from '../src'

export * from './basic.stories'
export * from './axes.stories'
export * from './config.stories'
export * from './event.stories'

export default {
  title: 'Others/Scrollbar',
  component: Scrollbar,
  decorators: [(story: Function) => <div>{story()}</div>],
}

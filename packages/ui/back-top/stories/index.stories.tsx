import React from 'react'
import BackTop from '../src'

export * from './basic.stories'
export * from './settings.stories'
export * from './custom.stories'
export * from './compose.stories'

export default {
  title: 'Others/BackTop',
  component: BackTop,
  decorators: [(story: Function) => <div>{story()}</div>],
}

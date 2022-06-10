import React from 'react'
import VirtualList from '../src'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/Toast',
  component: VirtualList,
  decorators: [(story: Function) => <div>{story()}</div>],
}

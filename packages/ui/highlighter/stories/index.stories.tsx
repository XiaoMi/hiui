import React from 'react'
import Highlighter from '../src'

export * from './basic.stories'
export * from './custom.stories'

export default {
  title: 'Private（暂不对外）/Highlighter',
  component: Highlighter,
  decorators: [(story: Function) => <div>{story()}</div>],
}

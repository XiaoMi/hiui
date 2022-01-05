import React from 'react'
import ZenMode from '../src'

export * from './basic.stories'

export default {
  title: 'Others/ZenMode',
  component: ZenMode,
  decorators: [(story: Function) => <div>{story()}</div>],
}

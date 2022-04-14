import React from 'react'
import Portal from '../src'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/Portal',
  component: Portal,
  decorators: [(story: Function) => <div>{story()}</div>],
}

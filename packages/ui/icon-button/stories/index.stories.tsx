import React from 'react'
import IconButton from '../src'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/IconButton',
  component: IconButton,
  decorators: [(story: Function) => <div>{story()}</div>],
}

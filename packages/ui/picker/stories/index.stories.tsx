import React from 'react'
import Picker from '../src'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/Picker',
  component: Picker,
  decorators: [(story: Function) => <div>{story()}</div>],
}

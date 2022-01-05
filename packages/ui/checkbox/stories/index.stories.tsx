import React from 'react'
import Checkbox from '../src'

export * from './basic.stories'

export default {
  title: 'Data Input/Checkbox',
  component: Checkbox,
  decorators: [(story: Function) => <div>{story()}</div>],
}

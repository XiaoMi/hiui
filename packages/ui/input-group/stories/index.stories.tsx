import React from 'react'
import InputGroup from '../src'

export * from './basic.stories'
export * from './group.stories'

export default {
  title: 'Data Input/InputGroup',
  component: InputGroup,
  decorators: [(story: Function) => <div>{story()}</div>],
}

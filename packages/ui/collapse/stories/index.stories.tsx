import React from 'react'
import Collapse from '../src'

export * from './basic.stories'

export default {
  title: 'Data Display/Collapse',
  component: Collapse,
  decorators: [(story: Function) => <div>{story()}</div>],
}

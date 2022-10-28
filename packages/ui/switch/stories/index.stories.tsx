import React from 'react'
import Switch from '../src'

export * from './basic.stories'
export * from './size.stories'
export * from './controlled.stories'
export * from './status.stories'
export * from './custom.stories'

export default {
  title: 'Data Input/Switch',
  component: Switch,
  decorators: [(story: Function) => <div>{story()}</div>],
}

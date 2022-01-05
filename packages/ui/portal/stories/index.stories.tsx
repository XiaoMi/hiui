import React from 'react'
import Portal from '../src'

export * from './basic.stories'

export default {
  title: 'Private/Portal',
  component: Portal,
  decorators: [(story: Function) => <div>{story()}</div>],
}

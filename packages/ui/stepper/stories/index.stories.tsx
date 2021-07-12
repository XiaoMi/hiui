import React from 'react'

export * from './basic.stories'
export * from './vertical.story'
export * from './vertical-layout.story'

export default {
  title: 'Stepper',
  decorators: [(story: Function) => <div>{story()}</div>],
}

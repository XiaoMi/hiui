import React from 'react'

export * from './basic.stories'
export * from './vertical.story'

export default {
  title: 'Stepper',
  decorators: [(story: Function) => <div>{story()}</div>],
}

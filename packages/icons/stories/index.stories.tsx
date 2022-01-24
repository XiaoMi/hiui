import React from 'react'

export * from './basic.stories'
export * from './tool-func.stories'

export default {
  title: 'Icons',
  decorators: [(story: Function) => <div>{story()}</div>],
}

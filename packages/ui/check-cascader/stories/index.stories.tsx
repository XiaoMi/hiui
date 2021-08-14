import React from 'react'

export * from './basic.stories'
export * from './embed.stories'

export default {
  title: 'CheckCascader',
  decorators: [(story: Function) => <div>{story()}</div>],
}

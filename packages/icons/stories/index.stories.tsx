import React from 'react'

export * from './basic.stories'

export default {
  title: 'Icons',
  decorators: [(story: Function) => <div>{story()}</div>],
}

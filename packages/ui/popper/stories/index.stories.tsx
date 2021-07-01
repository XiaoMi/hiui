import React from 'react'

export * from './basic.stories'

export default {
  title: 'Popper',
  decorators: [(story: Function) => <div>{story()}</div>],
}

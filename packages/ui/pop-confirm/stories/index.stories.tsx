import React from 'react'

export * from './basic.stories'

export default {
  title: 'PopConfirm',
  decorators: [(story: Function) => <div>{story()}</div>],
}

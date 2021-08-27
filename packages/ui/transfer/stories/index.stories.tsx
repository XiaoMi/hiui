import React from 'react'

export * from './basic.stories'

export default {
  title: 'Transfer',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'Alert',
  decorators: [(story: Function) => <div>{story()}</div>],
}

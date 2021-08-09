import React from 'react'

export * from './basic.stories'

export default {
  title: 'ZenMode',
  decorators: [(story: Function) => <div>{story()}</div>],
}

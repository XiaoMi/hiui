import React from 'react'

export * from './basic.stories'

export default {
  title: 'Icon',
  decorators: [(story: Function) => <div>{story()}</div>],
}

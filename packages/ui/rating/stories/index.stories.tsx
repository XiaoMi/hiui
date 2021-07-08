import React from 'react'

export * from './basic.stories'

export default {
  title: 'Rating',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'EmptyState',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'CascadeFilter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'Highlighter',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'Table',
  decorators: [(story: Function) => <div>{story()}</div>],
}

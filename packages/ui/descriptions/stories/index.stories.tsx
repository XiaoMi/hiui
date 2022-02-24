import React from 'react'

export * from './basic.stories'

export default {
  title: 'Descriptions',
  decorators: [(story: Function) => <div>{story()}</div>],
}

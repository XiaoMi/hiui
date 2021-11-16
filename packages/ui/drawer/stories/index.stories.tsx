import React from 'react'

export * from './basic.stories'

export default {
  title: 'Drawer',
  decorators: [(story: Function) => <div>{story()}</div>],
}

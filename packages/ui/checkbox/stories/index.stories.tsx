import React from 'react'

export * from './basic.stories'

export default {
  title: 'Data Input/Checkbox',
  decorators: [(story: Function) => <div>{story()}</div>],
}

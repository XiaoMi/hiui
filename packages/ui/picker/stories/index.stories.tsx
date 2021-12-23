import React from 'react'

export * from './basic.stories'

export default {
  title: 'Picker',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'FileSelect',
  decorators: [(story: Function) => <div>{story()}</div>],
}

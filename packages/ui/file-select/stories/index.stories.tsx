import React from 'react'
import FileSelect from '../src'

export * from './basic.stories'

export default {
  title: 'Data Input/FileSelect',
  component: FileSelect,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './uncontrolled.stories'

export default {
  title: 'CheckTreeSelect',
  decorators: [(story: Function) => <div>{story()}</div>],
}

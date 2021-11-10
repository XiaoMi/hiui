import React from 'react'

export * from './basic.stories'

export default {
  title: 'Dropdown',
  decorators: [(story: Function) => <div>{story()}</div>],
}

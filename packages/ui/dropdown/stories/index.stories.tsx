import React from 'react'

export * from './basic.stories'
export * from './disabled.stories'
export * from './trigger.stories'
export * from './multi-menu.stories'
export * from './placement.stories'
export * from './type.stories'

export default {
  title: 'Navigation/Dropdown',
  decorators: [(story: Function) => <div>{story()}</div>],
}

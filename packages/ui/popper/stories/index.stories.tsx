import React from 'react'
import Popper from '../src'

export * from './basic.stories'
export * from './placement.stories'
export * from './arrow.stories'
export * from './lazy.stories'
export * from './toggle.stories'
export * from './portal.stories'
export * from './container.stories'
export * from './hook.stories'

export default {
  title: 'Private（暂不对外）/Popper',
  component: Popper,
  decorators: [(story: Function) => <div>{story()}</div>],
}

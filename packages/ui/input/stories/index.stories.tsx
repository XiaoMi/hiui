import React from 'react'

export * from './basic.stories'
export * from './addon.stories'
export * from './appearance.stories'
export * from './clearable.stories'
export * from './focus.stories'
export * from './size.stories'
export * from './type.stories'
export * from './controlled.stories'

export default {
  title: 'Input',
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import PopConfirm from '../src'

export * from './basic.stories'
export * from './custom-icon.stories'
export * from './custom-content.stories'
export * from './custom-footer.stories'
export * from './async.stories'
export * from './gutter-gap.stories'
export * from './placement.stories'

export default {
  title: 'FeedBack/PopConfirm',
  component: PopConfirm,
  decorators: [(story: Function) => <div>{story()}</div>],
}

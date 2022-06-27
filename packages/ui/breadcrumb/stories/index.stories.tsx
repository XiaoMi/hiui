import React from 'react'
import Breadcrumb from '../src'

export * from './basic.stories'
export * from './size.stories'
export * from './custom-icon.stories'
export * from './separator.stories'

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  decorators: [(story: Function) => <div>{story()}</div>],
}

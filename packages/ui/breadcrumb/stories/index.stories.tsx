import React from 'react'
import Breadcrumb from '../src'

export * from './basic.stories'

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  decorators: [(story: Function) => <div>{story()}</div>],
}

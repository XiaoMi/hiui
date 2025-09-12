import React from 'react'
import PageHeader from '../src'

export * from './basic.stories'
export * from './back-icon.stories'
export * from './sub-title.stories'
export * from './extra.stories'
export * from './breadcrumb.stories'

export default {
  title: 'Navigation/PageHeader',
  component: PageHeader,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'

export default {
  title: 'Navigation/Breadcrumb',
  decorators: [(story: Function) => <div>{story()}</div>],
}

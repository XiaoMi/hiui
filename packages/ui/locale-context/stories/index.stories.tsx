import React from 'react'

export * from './basic.stories'

export default {
  title: 'LocaleContext',
  decorators: [(story: Function) => <div>{story()}</div>],
}

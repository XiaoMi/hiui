import React from 'react'
import CascadeFilter from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './underlined.stories'

export default {
  title: 'Data Input/CascadeFilter',
  component: CascadeFilter,
  decorators: [(story: Function) => <div>{story()}</div>],
}

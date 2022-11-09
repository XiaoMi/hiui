import React from 'react'
import Filter from '../src'

export * from './basic.stories'
export * from './cascade.stories'
export * from './controlled.stories'
export * from './underlined.stories'
export * from './appearance.stories'

export default {
  title: 'Data Input/Filter',
  component: Filter,
  decorators: [(story: Function) => <div>{story()}</div>],
}

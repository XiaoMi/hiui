import React from 'react'
import CheckSelect from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './uncontrolled.stories'
export * from './clearable.stories'
export * from './appearance.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './check-all.stories'
export * from './search.stories'
export * from './data-source.stories'
export * from './display-render.stories'
export * from './title-render.stories'
export * from './footer.stories'
export * from './filter-options.stories'
export * from './pinyin.stories'
export * from './virtual-list.stories'
export * from './empty-content.stories'
export * from './only-checked.stories'
export * from './tip.stories'
export * from './custom-render.stories'

export default {
  title: 'Data Input/CheckSelect',
  component: CheckSelect,
  decorators: [(story: Function) => <div>{story()}</div>],
}

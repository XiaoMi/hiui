import React from 'react'
import Select from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './uncontrolled.stories'
export * from './clearable.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './disabled.stories'
export * from './group.stories'
export * from './search.stories'
export * from './search-controlled.stories'
export * from './create-item.stories'
export * from './data-source.stories'
export * from './title-render.stories'
export * from './display-render.stories'
export * from './footer.stories'
export * from './filter-options.stories'
export * from './pinyin.stories'
export * from './virtual-list.stories'
export * from './empty-content.stories'
export * from './tip.stories'
export * from './addon.stories'
export * from './custom-render.stories'

export default {
  title: 'Data Input/Select',
  component: Select,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import CheckTreeSelect from '../src'

export * from './basic.stories'
export * from './controlled.stories'
export * from './uncontrolled.stories'
export * from './tag-input-wrap.stories'
export * from './appearance.stories'
export * from './size.stories'
export * from './clearable.stories'
export * from './searchable.stories'
// export * from './field-names.stories'
export * from './default-expand-all.stories'
export * from './check-all.stories'
// export * from './async.stories'
export * from './virtual-list.stories'
export * from './custom-render.stories'
export * from './addon.stories'

export default {
  title: 'Data Input/CheckTreeSelect',
  component: CheckTreeSelect,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'

export * from './basic.stories'
export * from './controlled.stories'
export * from './uncontrolled.stories'
export * from './appearance.stories'
export * from './clearable.stories'
export * from './searchable.stories'
export * from './field-names.stories'
export * from './default-expand-all.stories'
export * from './async.stories'

export default {
  title: 'TreeSelect',
  decorators: [(story: Function) => <div>{story()}</div>],
}

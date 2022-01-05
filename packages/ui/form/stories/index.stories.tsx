import React from 'react'
import Form from '../src'

export * from './basic.stories'
export * from './label-placement.stories'
export * from './placement.stories'
export * from './validate.stories'
export * from './validate-field.stories'
export * from './set-values.stories'
export * from './get-values.stories'
export * from './nested-field.stories'
export * from './list.stories'
export * from './cascade.stories'

export default {
  title: 'Data Input/Form',
  component: Form,
  decorators: [(story: Function) => <div>{story()}</div>],
}

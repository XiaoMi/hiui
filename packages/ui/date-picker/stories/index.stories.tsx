import React from 'react'
import DatePicker from '../src'

export * from './basic.stories'
export * from './appearance.stories'
export * from './year-month-week.stories'
export * from './cell-render.stories'
export * from './date-time.stories'
export * from './range.stories'
export * from './shortcut.stories'
export * from './lunar.stories'
export * from './size.stories'
export * from './footer-render.stories'
export * from './custom-render.stories'

export default {
  title: 'Data Input/DatePicker',
  component: DatePicker,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import DatePicker from '../src'

export * from './date.stories'
export * from './year-month-week.stories'
export * from './date-time.stories'
export * from './range.stories'
export * from './shortcut.stories'
export * from './lunar.stories'

export default {
  title: 'Data Input/DatePicker',
  component: DatePicker,
  decorators: [(story: Function) => <div>{story()}</div>],
}
import React from 'react'
import SvgIcon from '../src'

export * from './basic.stories'
export * from './viewbox.stories'

export default {
  title: 'Basic/SvgIcon',
  component: SvgIcon,
  decorators: [(story: Function) => <div>{story()}</div>],
}

import React from 'react'
import Toast from '../src'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/Toast',
  component: Toast,
  decorators: [(story: Function) => <div>{story()}</div>],
}

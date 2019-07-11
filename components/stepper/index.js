import Stepper from './Stepper'
import './style/index'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  [
    'data',
    'list',
    (data) => {
      return data.map(({ title, text, icon }) => ({
        title,
        content: text,
        icon
      }))
    }
  ],
  [
    'itemLayout',
    'up',
    (data) => {
      return data === true ? 'vertical' : 'horizontal'
    }
  ],
  [
    'placement',
    'vertical',
    (data) => {
      return data === true ? 'vertical' : 'horizontal'
    }
  ]
])(Stepper)

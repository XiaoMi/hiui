import React from 'react'
import Icon from '../icon'

import classNames from 'classnames'

import './style'
const prefixCls = 'hi-icontext'
const IconText = ({ name, style = {}, iconStyle, className, text }) => {
  return (
    <span className={`${prefixCls}`} style={style}>
      <Icon
        name={name}
        style={Object.assign({}, iconStyle, { marginRight: '2px' })}
        className={classNames(className, `${prefixCls}--icon`)}
      />
      {text}
    </span>
  )
}
export default IconText

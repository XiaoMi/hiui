import React from 'react'
import classNames from 'classnames'
import './index.scss'

const prefixCls = 'doc-components-badge'

/**
 * Declare component status
 *
 * @param {'deperacted' | 'feature' | 'warning'} type
 * @param {string} text
 * @param {*} {type, children, text}
 * @returns
 */
export const Badge = ({ type = 'deperacted', text }) => {
  const textCls = classNames(`${prefixCls}-text`, `${prefixCls}-${type}`)
  return (
    <span className={prefixCls}>
      <div className={textCls}>{text}</div>
    </span>
  )
}

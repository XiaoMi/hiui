import React from 'react'
import classNames from 'classnames'

const prefixCls = 'hi-list'
const isArray = arg => {
  return arg instanceof Array
}
const ExtraArray = ({ extra }) => {
  return (
    <ul className={`${prefixCls}-extra-items`}>
      {extra.map((item, index) => {
        return (
          <li className={`${prefixCls}-extra-item`} key={index}>
            {item}
          </li>
        )
      })}
    </ul>
  )
}
const Item = ({ title, titleTag, titleTagType, description, extra }) => {
  return (
    <div className={`${prefixCls}-item__content`} key='content'>
      {(title || titleTag) && (
        <div className={`${prefixCls}-item-title__content`}>
          {title && (
            <h4 className={`${prefixCls}-item__title`} key='title'>
              {title}
            </h4>
          )}
          {titleTag && (
            <span
              className={classNames(`${prefixCls}-item__titleTag`, {
                [`${prefixCls}-titleTag__${titleTagType}`]: titleTagType
              })}
              key='titleTag'
            >
              {titleTag}
            </span>
          )}
        </div>
      )}
      {description && (
        <div className={`${prefixCls}-item__desc`} key='description'>
          {description}
        </div>
      )}
      {extra && (
        <div className={`${prefixCls}-item__extra`} key='extra'>
          {isArray(extra) ? <ExtraArray extra={extra} /> : extra}
        </div>
      )}
    </div>
  )
}
export default Item

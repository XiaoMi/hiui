import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import Pagination from '../pagination'
import Item from './Item'
import IconText from './IconText'
import './style'

const prefixCls = 'hi-list'

const getPagePosition = pagination => {
  let pagePosition = 'flex-end'
  switch (pagination.position) {
    case 'left':
      pagePosition = 'start'
      break
    case 'middle':
      pagePosition = 'center'
      break

    case 'right':
      pagePosition = 'flex-end'
      break
    default:
      pagePosition = 'flex-end'
  }
  return pagePosition
}
const getActionPosition = actionPosition => {
  let _actionPosition = 'flex-end'
  switch (actionPosition) {
    case 'top':
      _actionPosition = 'flex-start'
      break
    case 'center':
      _actionPosition = 'center'
      break
    case 'bottom':
      _actionPosition = 'flex-end'
      break
    default:
      _actionPosition = 'flex-end'
  }
  return _actionPosition
}
const List = ({
  data,
  bordered,
  type,
  layout,
  hoverable,
  emptyText = '暂无数据',
  pagination = {},
  action,
  actionPosition = {},
  renderItem,
  ...others
}) => {
  const [datas, setData] = useState(data)
  const [paginationProps, setPaginationProps] = useState(pagination)
  useEffect(() => {
    setData(data)
    setPaginationProps(pagination)
  }, [data, pagination])
  const renderListItem = (item, index) => {
    const { avatar } = item || {}

    return (
      <li
        className={classNames(`${prefixCls}-item`, {
          [`${prefixCls}-item__card`]: type === 'card',
          [`${prefixCls}-item__colume`]: layout === 'vertical',
          [`${prefixCls}-item__hoverable`]: type === 'card' && hoverable
        })}
        key={index}
      >
        <div className={`${prefixCls}-item__row`} key='row'>
          {avatar && (
            <div className={`${prefixCls}-item__avatar`} key='avatar'>
              <img src={avatar} />
            </div>
          )}
          {renderItem && renderItem(item)}
        </div>

        {action && (
          <div
            className={`${prefixCls}-item__action`}
            key='action'
            style={{ alignSelf: getActionPosition(actionPosition) }}
          >
            {action(item)}
          </div>
        )}
      </li>
    )
  }
  return (
    <div className={`${prefixCls}`} {...others}>
      <ul
        className={classNames(`${prefixCls}-items`, {
          [`${prefixCls}-items__border`]: bordered && type !== 'card'
        })}
      >
        {datas && datas.length ? (
          datas.map((item, index) => {
            return renderListItem(item, index)
          })
        ) : (
          <li className={`${prefixCls}-item--empty`}>{emptyText}</li>
        )}
      </ul>
      {paginationProps && (
        <div
          style={{
            display: 'flex',
            justifyContent: getPagePosition(paginationProps),
            marginTop: '16px'
          }}
        >
          <Pagination {...paginationProps} />
        </div>
      )}
    </div>
  )
}
List.Item = Item
export { IconText }
export default List

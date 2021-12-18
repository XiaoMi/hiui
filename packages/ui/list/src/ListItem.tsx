import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { ListItemProps } from './List'
import { __DEV__ } from '@hi-ui/env'

const LIST_PREFIX = getPrefixCls('list')

/**
 * TODO: What is List
 */
type Position = 'flex-start' | 'flex-end' | 'center'

const getActionPosition = (actionPosition: 'top' | 'center' | 'bottom'): Position => {
  let _actionPosition: Position = 'flex-end'
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
export const ListItem: React.FC<ListItemProps> = ({
  prefixCls = LIST_PREFIX,
  className,
  title,
  description,
  extra,
  action,
  avatar,
  actionPosition = 'center',
}) => {
  return (
    <div className={cx(`${prefixCls}-item`, className)}>
      {avatar && (
        <div className={`${prefixCls}-item__avatar`} key="avatar">
          <img src={avatar} />
        </div>
      )}
      <div className={`${prefixCls}-item__content`}>
        {title && <div className={`${prefixCls}-item__title`}>{title}</div>}
        {description && <div className={`${prefixCls}-item__desc`}>{description}</div>}
        {extra && <div className={`${prefixCls}-item__extra`}>{extra}</div>}
      </div>
      {action && (
        <div
          className={`${prefixCls}-item__action`}
          key="action"
          style={{ alignSelf: getActionPosition(actionPosition) }}
        >
          {action}
        </div>
      )}
    </div>
  )
}

if (__DEV__) {
  ListItem.displayName = 'ListItem'
}

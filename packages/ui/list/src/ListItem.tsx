import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ListDataItem } from './types'

const LIST_PREFIX = getPrefixCls('list')

export const ListItem: React.FC<ListItemProps> = ({
  prefixCls = LIST_PREFIX,
  className,
  title,
  description,
  extra,
  action,
  avatar,
  actionPlacement = 'center',
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
          style={{ alignSelf: getActionPosition(actionPlacement) }}
        >
          {action}
        </div>
      )}
    </div>
  )
}

export interface ListItemProps extends HiBaseHTMLProps<'div'>, ListDataItem {}

if (__DEV__) {
  ListItem.displayName = 'ListItem'
}

const getActionPosition = (actionPosition: 'top' | 'center' | 'bottom') => {
  let _actionPosition: string = 'flex-end'
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

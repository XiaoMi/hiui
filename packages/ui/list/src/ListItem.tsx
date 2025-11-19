import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Avatar from '@hi-ui/avatar'
import { ListDataItem } from './types'

const LIST_ITEM_PREFIX = getPrefixCls('list-item')

export const ListItem: React.FC<ListItemProps> = ({
  prefixCls = LIST_ITEM_PREFIX,
  className,
  title,
  description,
  extra,
  action,
  avatar,
  actionPlacement = 'top',
}) => {
  const cls = cx(`${prefixCls}`, className)

  return (
    <div className={cls}>
      {avatar && (
        <div className={`${prefixCls}__avatar`} key="avatar">
          {typeof avatar === 'string' ? <Avatar size="sm" src={avatar} /> : avatar}
        </div>
      )}
      <div className={`${prefixCls}__content`}>
        {title && <div className={`${prefixCls}__title`}>{title}</div>}
        {description && <div className={`${prefixCls}__desc`}>{description}</div>}
        {extra && <div className={`${prefixCls}__extra`}>{extra}</div>}
      </div>
      {action && (
        <div
          className={`${prefixCls}__action`}
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

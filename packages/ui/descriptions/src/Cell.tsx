import * as React from 'react'
import { cx, getPrefixStyleVar } from '@hi-ui/classname'
import { isNullish } from '@hi-ui/type-assertion'
import { ContentPosition } from './types'

export const Cell: React.FC<CellProps> = ({
  itemPrefixCls,
  component,
  colSpan,
  rowSpan,
  className,
  style,
  bordered,
  label,
  content,
  labelWidth,
  cellColumnGap,
  contentPosition: contentPositionProp = 'top',
  ...rest
}) => {
  const Component: any = component

  if (bordered) {
    const compareStyle =
      !isNullish(labelWidth) && !isNullish(label)
        ? { ...style, width: labelWidth, wordBreak: 'break-word' }
        : style
    return (
      <Component
        className={cx(
          {
            [`${itemPrefixCls}-item__label`]: !isNullish(label),
            [`${itemPrefixCls}-item__content`]: !isNullish(content),
          },
          className
        )}
        style={compareStyle}
        colSpan={colSpan}
        rowSpan={rowSpan}
        {...rest}
      >
        {!isNullish(label) && <span>{label}</span>}
        {!isNullish(content) && <span>{content}</span>}
      </Component>
    )
  }

  const contentPosition = {
    top: 'start',
    center: 'center',
    bottom: 'end',
  }[contentPositionProp]
  console.log('contentPosition', contentPosition)

  return (
    <Component
      className={cx(`${itemPrefixCls}-item`, className)}
      style={style}
      colSpan={colSpan}
      {...rest}
    >
      <div
        className={`${itemPrefixCls}-item__container`}
        style={{
          [`${getPrefixStyleVar('container-padding-right')}`]:
            typeof cellColumnGap === 'number' ? cellColumnGap + 'px' : cellColumnGap,
          [`${getPrefixStyleVar('container-align-items')}`]: contentPosition,
        }}
      >
        {!isNullish(label) && (
          <span className={cx(`${itemPrefixCls}-item__label`)} style={{ width: labelWidth }}>
            {label}
          </span>
        )}
        {!isNullish(content) && (
          <span className={cx(`${itemPrefixCls}-item__content`)}>{content}</span>
        )}
      </div>
    </Component>
  )
}

export interface CellProps {
  itemPrefixCls: string
  colSpan?: number
  rowSpan?: number
  className?: string
  component: string
  style?: React.CSSProperties
  bordered?: boolean
  label?: React.ReactNode
  content?: React.ReactNode
  labelWidth?: React.ReactText
  cellColumnGap?: React.ReactText
  contentPosition?: ContentPosition
}

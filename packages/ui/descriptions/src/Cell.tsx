import * as React from 'react'
import { cx } from '@hi-ui/classname'
import { isNullish } from '@hi-ui/type-assertion'

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
      >
        {!isNullish(label) && <span>{label}</span>}
        {!isNullish(content) && <span>{content}</span>}
      </Component>
    )
  }

  return (
    <Component className={cx(`${itemPrefixCls}-item`, className)} style={style} colSpan={colSpan}>
      <div className={`${itemPrefixCls}-item__container`} style={{ paddingRight: cellColumnGap }}>
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
}

import * as React from 'react'
import { cx } from '@hi-ui/classname'
import { isNullish } from '@hi-ui/type-assertion'

export const Cell: React.FC<CellProps> = ({
  itemPrefixCls,
  component,
  span,
  className,
  style,
  bordered,
  label,
  content,
}) => {
  const Component: any = component

  if (bordered) {
    return (
      <Component
        className={cx(
          {
            [`${itemPrefixCls}-item__label`]: !isNullish(label),
            [`${itemPrefixCls}-item__content`]: !isNullish(content),
          },
          className
        )}
        style={style}
        colSpan={span}
      >
        {!isNullish(label) && <span>{label}</span>}
        {!isNullish(content) && <span>{content}</span>}
      </Component>
    )
  }

  return (
    <Component className={cx(`${itemPrefixCls}-item`, className)} style={style} colSpan={span}>
      <div className={`${itemPrefixCls}-item__container`}>
        {label && <span className={cx(`${itemPrefixCls}-item__label`)}>{label}</span>}
        {content && <span className={cx(`${itemPrefixCls}-item__content`)}>{content}</span>}
      </div>
    </Component>
  )
}

export interface CellProps {
  itemPrefixCls: string
  span: number
  className?: string
  component: string
  style?: React.CSSProperties
  bordered?: boolean
  label?: React.ReactNode
  content?: React.ReactNode
}

import * as React from 'react'
import classNames from 'classnames'
import { isNullish } from '@hi-ui/type-assertion'

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

const Cell: React.FC<CellProps> = ({
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
        className={classNames(
          {
            [`${itemPrefixCls}-item-label`]: !isNullish(label),
            [`${itemPrefixCls}-item-content`]: !isNullish(content),
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
    <Component
      className={classNames(`${itemPrefixCls}-item`, className)}
      style={style}
      colSpan={span}
    >
      <div className={`${itemPrefixCls}-item-container`}>
        {label && <span className={classNames(`${itemPrefixCls}-item-label`)}>{label}</span>}
        {content && <span className={classNames(`${itemPrefixCls}-item-content`)}>{content}</span>}
      </div>
    </Component>
  )
}

export default Cell

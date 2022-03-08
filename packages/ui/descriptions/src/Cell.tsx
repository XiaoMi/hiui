import * as React from 'react'
import classNames from 'classnames'

function notEmpty(val: any) {
  return val !== undefined && val !== null
}

export interface CellProps {
  itemPrefixCls: string
  span: number
  className?: string
  component: string
  style?: React.CSSProperties
  labelStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
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
  labelStyle,
  contentStyle,
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
            [`${itemPrefixCls}-item-label`]: notEmpty(label),
            [`${itemPrefixCls}-item-content`]: notEmpty(content),
          },
          className
        )}
        style={labelStyle}
        colSpan={span}
      >
        {notEmpty(label) && <span>{label}</span>}
        {notEmpty(content) && <span>{content}</span>}
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
        {label && (
          <span className={classNames(`${itemPrefixCls}-item-label`)} style={labelStyle}>
            {label}
          </span>
        )}
        {content && (
          <span className={classNames(`${itemPrefixCls}-item-content`)} style={contentStyle}>
            {content}
          </span>
        )}
      </div>
    </Component>
  )
}

export default Cell

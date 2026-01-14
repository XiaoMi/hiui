import * as React from 'react'
import { cx, getPrefixStyleVar } from '@hi-ui/classname'
import { isNullish } from '@hi-ui/type-assertion'
import { ContentPosition } from './types'
import type { DescriptionsSemanticName } from './Descriptions'

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
  cellClassNames,
  cellStyles,
  ...rest
}) => {
  const Component: any = component

  if (bordered) {
    const compareStyle =
      !isNullish(labelWidth) && !isNullish(label)
        ? { ...style, width: labelWidth, wordBreak: 'break-word', ...cellStyles?.cell }
        : { ...style, ...cellStyles?.cell }
    return (
      <Component
        className={cx(
          {
            [`${itemPrefixCls}-item__label`]: !isNullish(label),
            [`${itemPrefixCls}-item__content`]: !isNullish(content),
          },
          className,
          cellClassNames?.cell
        )}
        style={compareStyle}
        colSpan={colSpan}
        rowSpan={rowSpan}
        {...rest}
      >
        {!isNullish(label) && (
          <span className={cellClassNames?.label} style={cellStyles?.label}>
            {label}
          </span>
        )}
        {!isNullish(content) && (
          <span className={cellClassNames?.content} style={cellStyles?.content}>
            {content}
          </span>
        )}
      </Component>
    )
  }

  const contentPosition = {
    top: 'start',
    center: 'center',
    bottom: 'end',
  }[contentPositionProp]

  return (
    <Component
      className={cx(`${itemPrefixCls}-item`, className, cellClassNames?.cell)}
      style={{ ...style, ...cellStyles?.cell }}
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
          <span
            className={cx(`${itemPrefixCls}-item__label`, cellClassNames?.label)}
            style={{ width: labelWidth, ...cellStyles?.label }}
          >
            {label}
          </span>
        )}
        {!isNullish(content) && (
          <span
            className={cx(`${itemPrefixCls}-item__content`, cellClassNames?.content)}
            style={cellStyles?.content}
          >
            {content}
          </span>
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
  cellClassNames?: Partial<Record<DescriptionsSemanticName, string>>
  cellStyles?: Partial<Record<DescriptionsSemanticName, React.CSSProperties>>
}

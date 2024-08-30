import * as React from 'react'
import { DescriptionsItemProps } from './DescriptionsItem'
import { Cell } from './Cell'
import { ContentPosition } from './types'

export const Row: React.FC<RowProps> = (props) => {
  const { prefixCls, vertical, row, index, bordered, noBackground } = props

  if (vertical) {
    return (
      <>
        <tr key={`label-${index}`} className={`${prefixCls}-row`}>
          {renderCols(row, props, {
            component: 'th',
            type: 'label',
            showLabel: true,
          })}
        </tr>
        <tr key={`content-${index}`} className={`${prefixCls}-row`}>
          {renderCols(row, props, {
            component: 'td',
            type: 'content',
            showContent: true,
          })}
        </tr>
      </>
    )
  }

  return (
    <tr key={index} className={`${prefixCls}-row`}>
      {renderCols(row, props, {
        component: bordered || noBackground ? ['th', 'td'] : 'td',
        type: 'item',
        showLabel: true,
        showContent: true,
      })}
    </tr>
  )
}

export interface RowProps {
  prefixCls: string
  vertical: boolean
  row: React.ReactElement<DescriptionsItemProps>[]
  bordered?: boolean
  index: number
  rootLabelStyle?: React.CSSProperties
  rootContentStyle?: React.CSSProperties
  noBackground?: boolean
  labelPlacement?: 'left' | 'center' | 'right'
  rootLabelWidth?: React.ReactText
  cellColumnGap?: React.ReactText
  contentPosition?: ContentPosition
}

interface CellConfig {
  component: string | [string, string]
  type: string
  showLabel?: boolean
  showContent?: boolean
}

function renderCols(
  items: React.ReactElement<DescriptionsItemProps>[],
  {
    prefixCls,
    bordered,
    labelPlacement: labelPlacementContext,
    rootLabelWidth,
    cellColumnGap,
    contentPosition,
  }: RowProps,
  { component, type, showLabel, showContent }: CellConfig
) {
  return items.map(
    (
      {
        props: {
          label,
          children,
          prefixCls: itemPrefixCls = prefixCls,
          className,
          style,
          labelWidth,
          labelPlacement = labelPlacementContext,
          colSpan = 1,
          rowSpan,
        },
        key,
      },
      index
    ) => {
      if (typeof component === 'string') {
        return (
          <Cell
            key={`${type}-${key || index}`}
            className={className}
            style={style}
            colSpan={colSpan}
            rowSpan={rowSpan}
            component={component}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={showLabel ? label : null}
            content={showContent ? children : null}
            labelWidth={labelWidth ?? rootLabelWidth}
            cellColumnGap={index === items.length - 1 ? 0 : cellColumnGap}
            contentPosition={contentPosition}
          />
        )
      }

      return [
        <Cell
          key={`label-${key || index}`}
          className={className}
          style={{ textAlign: labelPlacement, ...style }}
          colSpan={1}
          rowSpan={rowSpan}
          component={component[0]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={label}
          labelWidth={labelWidth ?? rootLabelWidth}
          contentPosition={contentPosition}
        />,
        <Cell
          key={`content-${key || index}`}
          className={className}
          style={style}
          colSpan={colSpan * 2 - 1}
          rowSpan={rowSpan}
          component={component[1]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          content={children}
          contentPosition={contentPosition}
        />,
      ]
    }
  )
}

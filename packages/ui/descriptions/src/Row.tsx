import * as React from 'react'
import { DescriptionsItemProps } from './DescriptionsItem'
import { Cell } from './Cell'

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
  rootLabelWidth?: string
}

interface CellConfig {
  component: string | [string, string]
  type: string
  showLabel?: boolean
  showContent?: boolean
}

function renderCols(
  items: React.ReactElement<DescriptionsItemProps>[],
  { prefixCls, bordered, labelPlacement, rootLabelWidth }: RowProps,
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
          span = 1,
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
            span={span}
            component={component}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={showLabel ? label : null}
            content={showContent ? children : null}
            labelWidth={labelWidth ?? rootLabelWidth}
          />
        )
      }
      return [
        <Cell
          key={`label-${key || index}`}
          className={className}
          style={{ textAlign: labelPlacement, ...style }}
          span={1}
          component={component[0]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={label}
          labelWidth={labelWidth ?? rootLabelWidth}
        />,
        <Cell
          key={`content-${key || index}`}
          className={className}
          style={style}
          span={span * 2 - 1}
          component={component[1]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          content={children}
        />,
      ]
    }
  )
}

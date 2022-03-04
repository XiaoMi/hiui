import * as React from 'react'
import { DescriptionsItemProps } from './DescriptionsItem'
import Cell from './Cell'

interface CellConfig {
  component: string | [string, string]
  type: string
  showLabel?: boolean
  showContent?: boolean
  rootLabelStyle?: React.CSSProperties
  rootContentStyle?: React.CSSProperties
}

function renderCells(
  items: React.ReactElement<DescriptionsItemProps>[],
  { prefixCls, bordered, rootLabelStyle, rootContentStyle }: RowProps,
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
          span = 1,
          labelStyle,
          contentStyle,
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
            labelStyle={{ ...rootLabelStyle, ...labelStyle }}
            contentStyle={{ ...rootContentStyle, ...contentStyle }}
            span={span}
            component={component}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={showLabel ? label : null}
            content={showContent ? children : null}
          />
        )
      }
      return [
        <Cell
          key={`label-${key || index}`}
          className={className}
          style={style}
          span={1}
          component={component[0]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={label}
          labelStyle={{ ...rootLabelStyle, ...labelStyle }}
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
          contentStyle={{ ...rootContentStyle, ...contentStyle }}
        />,
      ]
    }
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
}

const Row: React.FC<RowProps> = (props) => {
  const { prefixCls, vertical, row, index, bordered } = props

  if (vertical) {
    return (
      <>
        <tr key={`label-${index}`} className={`${prefixCls}-row`}>
          {renderCells(row, props, {
            component: 'th',
            type: 'label',
            showLabel: true,
          })}
        </tr>
        <tr key={`content-${index}`} className={`${prefixCls}-row`}>
          {renderCells(row, props, {
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
      {renderCells(row, props, {
        component: bordered ? ['th', 'td'] : 'td',
        type: 'item',
        showLabel: true,
        showContent: true,
      })}
    </tr>
  )
}

export default Row

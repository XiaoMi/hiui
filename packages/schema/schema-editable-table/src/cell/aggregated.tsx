import React, { useMemo } from 'react'
import { isNil, random } from 'lodash-es'
import { Tag } from '@hi-ui/tag'
import type { CellContext } from '@tanstack/react-table'
import { colorPreset, ColorEnumPreset } from '@hi-ui/schema-fields'
import { useEditTableCtx } from '../ctx'
import { EMPTY_VALUE } from '../const'

export type AggregatedCellProps<TData extends AnyObject> = CellContext<TData, unknown>

export type AggregatedCellRenderCtxType<TData extends AnyObject> = AggregatedCellProps<TData> & {
  /**
   * 聚合值
   * - 指聚合列的当前行值
   */
  groupingValue: unknown
  /** 聚合列的ID */
  groupingColumnId: string
  /**
   * 聚合列经聚合函数计算后聚合值
   * - 例如聚合函数为 count，则聚合值为聚合列的行数
   */
  groupingColumnAggregatedValue: unknown
  /**
   * 经处理后的聚合值
   * - 会在为空值时自动展示为【空值】
   */
  displayValue: unknown
  /**
   * 标签颜色
   * - 内部随机生成的标签颜色样式配置
   * - 会在单次挂载中保持稳定
   */
  color: { back: string; fore: string }
  /** 默认的内部结构元素 */
  dftEl: React.ReactElement
}

export default React.memo(
  function AggregatedCell<TData extends AnyObject>(props: AggregatedCellProps<TData>) {
    const { row } = props
    const { groupingValue, groupingColumnId } = row
    const { propsRef } = useEditTableCtx<TData>()

    // TODO 待增加自定义颜色配置传入
    const color = useMemo(() => {
      const name = ColorEnumPreset[random(0, ColorEnumPreset.length - 1)]
      return colorPreset[name]
    }, [])

    // 如果groupingColumnId为空，则无法显示
    if (isNil(groupingColumnId)) return null

    // 处理空值情况，识别特殊标记__EMPTY_VALUE__
    const displayValue = groupingValue === EMPTY_VALUE ? '空值' : groupingValue

    // 当前被分组的列，经聚合函数处理后的值
    const groupingColumnAggregatedValue = row.$getAggregatedValue(groupingColumnId)

    const dftEl = (
      <span
        // span
        data-grouping-column-id={groupingColumnId}
        className="flex-center"
        style={{ gap: 4 }}
      >
        <span>
          <Tag color={color.fore} background={color.back}>
            {displayValue}
          </Tag>
        </span>
        <span style={{ fontSize: 12 }}>共 {groupingColumnAggregatedValue} 条</span>
      </span>
    )

    // 自定义【有效聚合单元格】渲染逻辑
    if (propsRef.current.customCell?.renderAggregatedCell) {
      return propsRef.current.customCell.renderAggregatedCell({
        ...props,
        groupingValue,
        groupingColumnId,
        groupingColumnAggregatedValue,
        displayValue,
        dftEl,
        color,
      })
    }

    return dftEl
  }
  // propsAreEqual暂时置空
) as <TData extends AnyObject>(props: AggregatedCellProps<TData>) => React.ReactElement

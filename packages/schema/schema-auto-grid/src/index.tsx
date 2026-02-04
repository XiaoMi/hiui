import React from 'react'
import Grid from '@hi-ui/grid'
import { mergeProps, getPipeGetterValue, PipeGetter } from '@hi-ui/schema-utils'
import type { RowProps, ColProps } from '@hi-ui/grid'
import { dftColumnCount, type UseColumnCountCtxType } from './use-count'
import { isInvalidGridEl, getGridElSpan } from './utils'

export * from './use-count'
export * from './utils'

export type { RowProps, ColProps }

export type ColPropsExtraType = {
  /** 网格总列数(例如24) */
  columns?: number
  /** 实际可视列数(例如3) */
  columnCount?: number
}

export type GridHelperNodeType = {
  key: React.Key
  elem: React.ReactElement | null
  props?: PipeGetter<ColProps, ColPropsExtraType>
}

export type GridHelperProps = RowProps & {
  /** 列定义列表 */
  nodes?: GridHelperNodeType[]
  /**
   * 子元素列表
   * @desc 存在子元素时，会自动按照默认的配置增加网格包裹
   * @desc 此时无法设置 offset 等 colProps 上的配置
   * @desc 如果需要精确设置，请使用 nodes 配置
   */
  children?: React.ReactNode[]
} & Pick<UseColumnCountCtxType, 'columnCount'>

export type BasicGridOptsType = Pick<
  GridHelperProps,
  // 基础配置
  'columnCount' | 'gutter' | 'rowGap'
>

export { DynamicColumnCountInjector, extractGridProps } from './dynamic'
export type { DynamicGridHelperProps } from './dynamic'

const dftColumns = 24

export function GridHelper(props: GridHelperProps) {
  const {
    nodes,
    columnCount: validColumnCount = dftColumnCount,
    // rowProps 依赖 restRowProps
    // 自定义属性需要在上面全部取出
    ...restRowProps
  } = props

  const rowProps = mergeProps<RowProps>(
    {
      columns: dftColumns,
      gutter: true, // 默认值是48
      rowGap: 0,
    },
    restRowProps
  )

  // 最终的网格列数
  // // 下面这里的 ?? 其实只是为了收窄类型，rowProps 中必然有columns
  const validColumns = rowProps.columns ?? dftColumns
  // 计算每个元素占据的网格列数
  const colSpan = Math.floor(validColumns / validColumnCount)

  // 存在 children 时，自动按照默认的配置增加网格配置
  if (props.children) {
    const validChildren = React.Children.toArray(props.children).filter((child) =>
      React.isValidElement(child)
    )
    if (validChildren.length === 0) return null

    return (
      <Grid.Row {...rowProps}>
        {validChildren.map((child, index) => {
          // 先尝试从元素上获取 span 配置，若无则使用默认的 colSpan
          const span = getGridElSpan(child) ?? colSpan
          return (
            <Grid.Col key={child.key ?? index} span={span}>
              {child}
            </Grid.Col>
          )
        })}
      </Grid.Row>
    )
  }

  if (!nodes?.length) return null
  return (
    <Grid.Row {...rowProps}>
      {nodes.map((col, index) => {
        const colProps = getPipeGetterValue({ span: colSpan }, col.props, {
          columns: validColumns,
          columnCount: validColumnCount,
        })

        // 无效元素直接跳过
        if (isInvalidGridEl(col.elem)) return null
        return (
          <Grid.Col key={col.key ?? index} {...colProps}>
            {col.elem}
          </Grid.Col>
        )
      })}
    </Grid.Row>
  )
}

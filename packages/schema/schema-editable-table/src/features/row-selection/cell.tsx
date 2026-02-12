import React from 'react'
import { Checkbox } from '@hi-ui/checkbox'
import { Radio } from '@hi-ui/radio'
import type { Row } from '@tanstack/react-table'
import { Schedular } from '@hi-ui/schema-utils'
import type { BoolConfig } from '@hi-ui/schema-utils'
import { useEditableSchemaTableCtx } from '../../ctx'
import { cls } from '../../utils/cls'
import { dftSelectionType } from './const'
import type { RowSelectionIndicatorOpts } from './indicator'

type RowSelectionOnCheckAllChangeCtxType = {
  checked: boolean
  indeterminate: boolean
}

export type RowSelectionOptsType<TData extends AnyObject = AnyObject> = {
  type?: 'checkbox' | 'radio'
  onChange?: (selected: { keys: string[]; rows: TData[] }) => void
  onCheckAllChange?: (ctx: RowSelectionOnCheckAllChangeCtxType) => void
  /**
   * 是否在数据被删除时，仍保留已选择的数据
   * - 建议在启用后端分页时打开该选项
   */
  preserveSelectedRows?: boolean
  /**
   * 根据行数据决定是否启用行选择
   * @desc 会在行选择状态变化时重新调用
   * @desc 默认全部可以选中
   */
  enableRowSelection?: (rowData: TData, ctx: { row: Row<TData> }) => boolean
  /**
   * 根据行数据决定是否启用子行选择
   * @desc 会在行选择状态变化时重新调用
   * @desc 默认全部可以选中子行
   */
  enableSubRowSelection?: (rowData: TData, ctx: { row: Row<TData> }) => boolean
  /**
   * 是否启用动态行可选状态支持
   * @deprecated 经过性能优化，已无需通过此处配置来控制是否订阅
   * @desc 启用后 SelectionCell 会在任意行选择状态发生变化时触发重渲染
   * @desc 会有性能下降，避免在大数据量的表格使用
   */
  enableDynamicRowSelection?: boolean
  // 暂时注释，后续再看要不要继续扩展
  // getCheckboxProps?: (record: TData) => { disabled?: boolean } | undefined
  // selectedRowKeys?: React.Key[]
  /** 初次加载时默认选中的行 */
  dftSelectedRowKeys?: (string | number)[]
  /**
   * 是否启用点击行选择
   * @desc 启用后，点击行的任意只读单元格均会触发选中
   * @desc 若与分页同时启用，则必须传入 rowKey 配置，否则无法正确选中
   */
  enableClickSelect?: boolean
  /**
   * 是否启用行选择指示器
   * @desc 启用后，会在表格底部显示一个行选择指示器，展示当前选中的行的数量
   */
  enableIndicator?: BoolConfig<RowSelectionIndicatorOpts>
}

export function SelectionHeaderCell() {
  const { table, propsRef } = useEditableSchemaTableCtx()

  // // 经过性能优化，已移除额外订阅
  // // 此时保留，反而会导致本组件重复重渲染
  // // 保留此处注释，用以后续调整
  // const { rowSelectionState } = useEditableSchemaTableCtx()
  // useSubscribe(rowSelectionState)

  const { rowSelection } = propsRef.current
  if (!rowSelection) return null // 其实走不到，仅用来收窄类型

  const { type = dftSelectionType } = rowSelection
  /** 修复 <th> 元素嵌套在另一个 <th> 元素中，违反 HTML 规范的问题 */
  if (type === 'radio') return <div className={cls('header-cell')}></div>

  // NOTE: 表头全选更改为仅选择当页数据
  const checked = table.getIsAllPageRowsSelected()
  const indeterminate = table.getIsSomePageRowsSelected()

  const handleChange = function handleCheckAllChange(event: React.ChangeEvent<HTMLInputElement>) {
    const innerHandler = table.getToggleAllPageRowsSelectedHandler()
    innerHandler(event)

    // 稍微延迟一下，等待内部状态完成更新
    Schedular.nextMicro(() => {
      const checked = table.getIsAllPageRowsSelected()
      const indeterminate = table.getIsSomePageRowsSelected()
      rowSelection.onCheckAllChange?.({ checked, indeterminate })
    })
  }

  return (
    <Checkbox
      // Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleChange}
    />
  )
}

type SelectionBodyCellProps<TData extends AnyObject> = {
  row: Row<TData>
}

export function SelectionBodyCell<TData extends AnyObject>(props: SelectionBodyCellProps<TData>) {
  const { row } = props

  const { propsRef } = useEditableSchemaTableCtx<TData>()
  const { rowSelection } = propsRef.current
  const { type = dftSelectionType } = rowSelection || {}

  // // 经过性能优化，已移除额外订阅
  // // 此时保留，反而会导致本组件重复重渲染
  // // 保留此处注释，用以后续调整
  // const { rowSelectionState } = useEditableSchemaTableCtx<TData>()
  // const { enableDynamicRowSelection } = rowSelection || {}
  // useSubscribe(
  //   rowSelectionState,
  //   // 如果启用了动态行可选状态支持，则不订阅(相当于订阅全部变化)
  //   enableDynamicRowSelection ? undefined : [row.id]
  // )

  if (!rowSelection) return null // 其实走不到，仅用来收窄类型
  const SelectComp = type === 'radio' ? Radio : Checkbox

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const innerHandler = row.getToggleSelectedHandler()
    innerHandler(event)
    // 上面是行本身的变化处理逻辑

    // 下面是存在父行的情况，需要处理父行的选中状态
    row.$afterToggleSelected()
  }

  // 根据组件类型决定是否传递 indeterminate 属性
  const commonProps = {
    checked: row.getIsSelected(),
    onChange: handleChange,
    disabled: !row.getCanSelect(),
  }

  // 只有 Checkbox 支持 indeterminate 属性
  if (type === 'checkbox') {
    return <SelectComp {...commonProps} indeterminate={row.getIsSomeSelected()} />
  }

  return <SelectComp {...commonProps} />
}

import React from 'react'
import type { BoolConfig } from '@hi-ui/schema-utils'
import { ROW_INDEX_COL_ID } from '../const'
import type {
  FieldCustomHeaderActionsFn,
  FieldCustomHeaderActionComponent,
  ProNumberProps,
  ProTextProps,
} from '../interface'
import { EditableFieldCreator } from './editable'
import type {
  FieldControlType,
  FieldFilterConfigType,
  FieldGroupingConfigType,
  FieldSorterConfigType,
} from './type'

export class EditableTableFieldCreator<
  FieldProps = AnyObject,
  WrapperProps = AnyObject
> extends EditableFieldCreator<FieldProps, WrapperProps> {
  /**
   * EditTable
   * @desc 在 ET 中不允许使用 EditTable
   */
  EditTable() {
    return this
  }

  Text(opts?: ProTextProps) {
    return super.Text({ autoFocus: true, ...opts })
  }

  Number(opts?: ProNumberProps) {
    return super.Number({ autoFocus: true, ...opts })
  }

  /**
   * 设置只读属性
   * - 请注意，ET 中的 RO 会额外设置字段为简单模式
   * - 若需要执行单元格的只读逻辑，需额外增加 `.Simple(false)`
   */
  RO(readonly: boolean | 'undefined' = true) {
    if (readonly === 'undefined') return this
    return this._mergeVal({ control: { readonly, simple: true } })
  }

  /** 设置可编辑属性 */
  Edit(editable = true) {
    return this._mergeVal({ control: { editable } })
  }

  /**
   * 【动态】判断字段是否可编辑
   * - 会在字段内部完成【只读/可编辑/运行时可编辑】的判断后介入
   * - 仅在上述判断为【可编辑】时，才会调用本函数
   * - 本函数返回真值时，字段开启编辑，否则改为只读
   */
  DynamicEdit(fn: FieldControlType['dynamicEditable']) {
    return this._mergeVal({ control: { dynamicEditable: fn } })
  }

  /** 设置字段是否简单模式 */
  Simple(simple = true) {
    return this._mergeVal({ control: { simple } })
  }

  /** 设置字段是否固定 */
  Fixed(position?: 'left' | 'right') {
    return this._mergeVal({ control: { fixed: position } })
  }

  /** 设置字段是否仅在 hover 时显示表头操作 */
  HoverOnly(enable = true) {
    return this._mergeVal({ control: { hoverOnly: enable } })
  }

  /** 设置字段是否启用过滤 */
  Filter(config: BoolConfig<FieldFilterConfigType> = true) {
    return this._mergeVal({ control: { filter: config } })
  }

  /** 设置字段是否启用排序 */
  Sorter(config: BoolConfig<FieldSorterConfigType> = true) {
    return this._mergeVal({ control: { sorter: config } })
  }

  /** 设置字段是否启用分组 */
  Grouping(config: BoolConfig<FieldGroupingConfigType> = true) {
    return this._mergeVal({ control: { grouping: config } })
  }

  RowIndex() {
    const key = ROW_INDEX_COL_ID
    this.Align('center')
    this._mergeVal({ key, dataIndex: key }).W(60)
    return this.renderCell((_, ctx) => {
      return <span data-case="default">{ctx.rowIndex + 1}</span>
    }).RO()
  }

  /**
   * 展示根据指定字段分组合并后的序号
   * 需要配合 setRowSpanForFields 使用，且需要指定主字段
   */
  GroupIndex(mainField: string) {
    return this.RowIndex()
      .renderCell((_, ctx) => {
        return (
          <span data-case="default">
            {ctx.rowData[`_$rowSpan:${mainField}:groupIndex`] !== undefined
              ? ctx.rowData[`_$rowSpan:${mainField}:groupIndex`]
              : ctx.rowIndex + 1}
          </span>
        )
      })
      .Control({
        bodyCell: ({ rowData }) => ({ rowSpan: rowData[`_$rowSpan:${mainField}`] }),
      })
  }

  /**
   * 设置单个自定义表头操作
   * @param Component 自定义表头操作组件
   */
  HeaderAction(Component: FieldCustomHeaderActionComponent) {
    return this._mergeVal({
      extra: {
        headerActions: function EditableTableFieldCreatorHeaderAction(ctx) {
          // @ts-expect-error 忽略类型推导
          const el = <Component key="single-custom-header-action" {...ctx} />
          return [el, ctx.builtin.sorter, ctx.builtin.filter]
        },
      },
    })
  }

  /**
   * 设置多个自定义表头操作
   * @param fn 自定义表头操作函数
   */
  HeaderActions(fn: FieldCustomHeaderActionsFn) {
    return this._mergeVal({ extra: { headerActions: fn } })
  }
}

type EditableTableFieldCreatorParams = ConstructorParameters<typeof EditableTableFieldCreator>

export const ET = (...params: EditableTableFieldCreatorParams) =>
  new EditableTableFieldCreator<AnyObject>(...params)

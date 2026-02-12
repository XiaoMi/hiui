import type { RowData, Cell, RowSelectionState } from '@tanstack/react-table'
import type { ProFieldMapType } from '@hi-ui/schema-fields'
import type { SubscriptionType } from '@hi-ui/use-subscription'
import type {
  FieldConfigType,
  FieldControlType,
  FieldFilterConfigType,
  FieldGroupingConfigType,
  FieldPayloadType,
  FieldSorterConfigType,
} from '@hi-ui/schema-core'
import type { InnerRefType } from './src/ctx'

declare module '@tanstack/react-table' {
  interface CoreInstance<TData extends RowData> {
    $getInnerRef: () => InnerRefType<TData>
    $getCell: (cellId: string) => Cell<TData, unknown> | null
    /**
     * 获取指定行的实时数据
     * @desc 与 row.original 的区别在于，会返回内部订阅中的最新数据
     */
    $getRealtimeRowData: (rowId: string) => TData | undefined
    /**
     * 缓存选中行的原始数据
     * - key 为行 id, value 为行数据
     * - 仅在开启 preserveSelectedRows 时有效
     * - 其余时间仅为一个空 Map
     */
    $selectedRowsCache: Map<string, TData>
    /**
     * 缓存当前选中状态
     * - rows 为选中行的原始数据
     * - keys 为选中行的 id
     */
    $rowSelectionCache: {
      selectedRows: TData[]
      selectedRowKeys: string[]
      selectedRowEntries: [string, TData][]
    }
    /**
     * 更新选中行原始数据的缓存
     */
    $updateSelectedRowsCache: (entries: [string, TData][]) => void
    /**
     * 获取选中行的原始数据
     * - 会根据行选中状态，返回内部订阅中的最新数据
     */
    $getRowSelection: (state?: RowSelectionState) => {
      selectedRows: TData[]
      selectedRowKeys: string[]
      selectedRowEntries: [string, TData][]
    }
  }

  interface CoreRow<TData extends RowData> {
    /**
     * 获取指定列的聚合后的值
     */
    // 原因是内置的 getValue 在识别到指定列是分组列后
    // 会直接返回列本身的值，而不是返回聚合后的值
    $getAggregatedValue: <TValue>(columnId: string) => TValue | undefined
    /**
     * 获取指定行的实时数据
     * @desc 与 row.original 的区别在于，会返回内部订阅中的最新数据
     */
    // 与表格实例的 getRealtimeRowData 效果一致
    $getRealtimeRowData: () => TData
  }

  interface CoreCell {
    /**
     * 获取指定列的聚合后的值
     */
    // 与行的 getAggregateValue 效果一致
    $getAggregatedValue: <TValue>() => TValue | undefined
    /**
     * 获取指定行的实时数据
     * @desc 与 row.original 的区别在于，会返回内部订阅中的最新数据
     */
    // 与表格实例的 getRealtimeRowData 效果一致
    $getRealtimeRowData: () => TData
  }

  interface TableMeta<TData extends RowData>
    extends Pick<FieldControlType, 'editable' | 'readonly' | 'disabled'> {
    /** 表格数据订阅 */
    subscription: SubscriptionType<TData[]>
    fieldMap?: Partial<ProFieldMapType>
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    getCellValue: (rowIndex: number, columnId: string) => unknown
    innerRef: InnerRefType<TData>
  }

  interface ColumnMeta<TData extends RowData, TValue>
    extends Pick<
        FieldControlType,
        | 'editable'
        | 'readonly'
        | 'disabled'
        | 'simple'
        | 'fixed'
        | 'align'
        | 'headerCell'
        | 'bodyCell'
        // 下面三个会被更下面的三处定义覆盖
        | 'filter'
        | 'sorter'
        | 'grouping'
      >,
      Pick<FieldPayloadType, 'shouldUpdate'> {
    field: FieldConfigType // 存储原始字段配置
    filter?: FieldFilterConfigType
    sorter?: FieldSorterConfigType
    grouping?: FieldGroupingConfigType
    _IGNORE_ME_?: (data: TData) => TValue // 防止泛型参数未被使用
  }

  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    meta: ColumnMeta<TData, TValue>
  }

  interface PaginationState {
    rowCount: number
    /** 标记是否内部手动设置分页状态 */
    $fromCustom?: boolean
  }
  interface PaginationInstance {
    originalResetPagination: (defaultState?: boolean) => void
  }

  interface RowSelectionRow {
    /** 切换行选择状态后，处理父行选中状态的逻辑 */
    $afterToggleSelected: () => void
  }

  interface TableState {
    /**
     * 自定义的列折叠状态
     * @desc 仅对存在子列的父列生效
     */
    customColumnCollapsing?: Record<string, boolean>
  }
}

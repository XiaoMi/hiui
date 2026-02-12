// 导出主要组件
export { default as Body, type EditTableBodyProps } from './body'
export { default as Header, type EditTableHeaderProps } from './header'
export { default as Footer, type EditTableFooterProps } from './footer'
export { default as Cell, FooterCell } from './cell'
export { EditableSchemaTable, EditableSchemaTable as EditTable } from './table'
export type { EditableSchemaTableProps, EditableSchemaTableProps as EditTableProps } from './table'

// 内部上下文
export { useEditableSchemaTableCtx, useEditTableCtx } from './ctx'
export type { TableCtxRefType } from './table'
export type {
  EditableSchemaTableCtxType,
  EditableSchemaTableCtxType as EditTableCtxType,
} from './ctx'

// 导出容器组件
export { TableContainer, useTableContainer } from './container'
export { useRowVirtualizer, useColumnVirtualizer } from './container/hooks'
export type { TableStickyOpts, VirtualizeConfig } from './container'
// 导出底部渲染器
export { BottomRender } from './container/bottom'
export type { BottomRenderConfigType } from './container/bottom'

// 导出工具组件
export { validateHeaderCell } from './header/validate'

// 导出部分功能及定义
export { useTableSetting } from './features/setting-bridge'
export { useDataFetcher, defineDataFetcher } from './features/async-data'
export { ColumnCollapsingAction } from './features/header-actions'
export { TableRowController } from './features/row-controller'
export type {
  GetDataSourceType,
  GetDataSourceBasicParamsType,
  GetDataSourceParamsType,
  GetDataSourceResType,
  AsyncDataOptsType,
} from './features/async-data'
export type { OpButtonConfigType, RowOperationOptsType } from './features/row-operation'
export type { RowSelectionOptsType } from './features/row-selection'
export type { TableRowControllerType } from './features/row-controller'
export type { UseTableSettingProps } from './features/setting-bridge'

// 以下导出以供 schema-types
export type { GetHeaderCellWrapperDynamicAttrsFnType } from './header'
export type { GetBodyCellWrapperDynamicAttrsFnType } from './body/wrapper'
export type {
  FieldCustomHeaderActionsFn,
  FieldCustomHeaderActionComponent,
} from './features/header-actions/type'

// 以下导出以供其他包使用
export type { OpButtonRenderCtx } from './features/row-operation/buttons'
export type { BottomRenderCtxType } from './container/bottom'
export { normalizeValueFromChange } from './cell/editing'
export { clsPrefix } from './utils/cls'

// 可编辑表作为字段的实现
export {
  ProEditTable,
  type ProEditTableProps,
  type FormEditTableToolbarCtxType,
} from './field-bridge'

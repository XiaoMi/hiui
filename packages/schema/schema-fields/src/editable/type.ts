// export type DynamicEditableCtxType =
//   | {
//       type: 'edit-table'
//       rowIndex: number
//       rowId: string
//       columnIndex: number
//       columnId: string
//       /** 原始行数据 */
//       rawData: AnyObject
//     }
//   | {
//       type: 'edit-description'
//     }

// TODO 需要补充 edit-description 的类型支持
// 接口声明合并不允许使用联合类型，此处暂时仅处理 edit-table 的类型
export type DynamicEditableCtxType = {
  type: 'edit-table'
  rowIndex: number
  rowId: string
  columnIndex: number
  columnId: string
  /** 原始行数据 */
  rawData: AnyObject
}

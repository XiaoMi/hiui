export type ColumnFixedType = 'left' | 'right' | false

export type ColumnSetting = {
  visible: boolean
  fixed: ColumnFixedType
  order: number
}

export type TableColumn = {
  id: string
  title: string
  /** 是否默认固定 */
  fixed?: ColumnFixedType
  /** 是否默认隐藏 */
  hidden?: boolean
}

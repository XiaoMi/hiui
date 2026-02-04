export const ROW_HEIGHT = 40

export const ROW_SELECTION_COL_ID = '_row_selection_'
export const ROW_SELECTION_COL_WIDTH = 50
export const ROW_INDEX_COL_ID = '_row_index_'

export const ROW_OPERATION_COL_ID = '_row_operation_' // 操作列
export const ROW_OPERATION_COL_WIDTH = 160

export function isSystemCol(id: string) {
  return id === ROW_INDEX_COL_ID
}

// 分组特性中用于标识空值的特殊标记
export const EMPTY_VALUE = '__EMPTY_VALUE__'

export const SELECTED_OPTION_RAW = '_selected_raw_option_'

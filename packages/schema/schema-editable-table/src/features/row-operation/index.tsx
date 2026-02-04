import { OperationHeader, OperationBody, OperationFooter } from './wrapper'
import type { OpButtonsProps } from './buttons'

export type { OpButtonConfigType } from './buttons'

export type RowOperationOptsType<TData extends AnyObject = AnyObject> = Omit<
  OpButtonsProps<TData>,
  'row'
> & {
  /** 列宽 */
  width?: number
  /**
   * 表头文本
   * - 默认值为中文【操作】
   */
  headerText?: string
}

export const dftOpButtonCount = 3

export const RowOperation = {
  Header: OperationHeader,
  Body: OperationBody,
  Footer: OperationFooter,
}

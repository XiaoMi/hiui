import { produce, type Draft } from 'immer'
import { uuid } from '@hi-ui/use-id'
import { cloneDeep, set } from 'lodash-es'
import { Subscription, type SubscriptionType } from '@hi-ui/use-subscription'
import type { EditableSchemaTableCtxType } from '../ctx'
import type { EditTableProps } from '../index'

type TableRowControllerExtraOpts = {
  /** 是否开启行编辑 */
  rowEdit?: boolean
  // 不关心 TData 类型，所以使用 AnyType
  propsRef?: EditableSchemaTableCtxType<AnyType>['propsRef']
}

export class TableRowController<TData extends AnyObject = AnyObject> {
  /** 表格数据订阅 */
  private subscription: SubscriptionType<TData[]>
  /** 当前正在编辑的行索引订阅 */
  editingSubscription: SubscriptionType<Record<string, boolean>> | null = null

  /** 当前正在编辑的行索引 */
  private editingIndex: number | null = null

  private propsRef: TableRowControllerExtraOpts['propsRef']
  private onValuesChange?: EditTableProps<TData>['onValuesChange']
  private afterRowsOperation() {
    this.onValuesChange?.({}, this.subscription.getValue())
  }

  constructor(subscription: SubscriptionType<TData[]>, opts?: TableRowControllerExtraOpts) {
    this.subscription = subscription

    // 行编辑模式下，需要知道 propsRef 以便在保存时调用 propsRef.current.onValuesChange
    this.propsRef = opts?.propsRef
    this.onValuesChange = opts?.propsRef?.current.onValuesChange

    // 如果开启了行编辑，则创建一个当前正在编辑的行索引订阅
    if (opts?.rowEdit) this.editingSubscription = new Subscription({})
  }

  private get isEditing() {
    return this.editingIndex !== null
  }

  /** 检查是否处于编辑状态 */
  private checkEditing(): boolean {
    if (this.isEditing) {
      // TODO: add logging if needed
      // console.log('Operation blocked: table is in editing mode')
      return true
    }
    return false
  }

  /**
   * 在指定位置添加新行
   * @param data 行数据
   * @param index 插入位置索引，可选，默认添加到末尾。如果为负数则插入到开头，如果超出长度则插入到末尾
   */
  addRow(data: Partial<TData>, index?: number) {
    if (this.checkEditing()) return

    this.subscription.setValue(
      produce((draft) => {
        if (typeof index === 'number') {
          const normalizedIndex = Math.floor(Math.max(0, Math.min(draft.length, index)))
          draft.splice(normalizedIndex, 0, data as Draft<TData>)
        } else {
          draft.push(data as Draft<TData>)
        }
      })
    )
    this.afterRowsOperation()
  }

  /**
   * 删除指定行
   * @param index 要删除的行索引
   */
  deleteRow(index: number) {
    if (this.checkEditing()) return

    this.subscription.setValue(
      produce((draft) => {
        if (index >= 0 && index < draft.length) {
          draft.splice(index, 1)
        }
      })
    )
    this.afterRowsOperation()
  }

  /**
   * 批量添加多行
   * @param rows 要添加的行数据数组
   * @param index 插入位置索引，可选，默认添加到末尾。如果为负数则插入到开头，如果超出长度则插入到末尾
   */
  addRows(rows: Partial<TData>[], index?: number) {
    if (this.checkEditing()) return

    this.subscription.setValue(
      produce((draft) => {
        if (typeof index === 'number') {
          const normalizedIndex = Math.floor(Math.max(0, Math.min(draft.length, index)))
          draft.splice(normalizedIndex, 0, ...(rows as Draft<TData>[]))
        } else {
          draft.push(...(rows as Draft<TData>[]))
        }
      })
    )
    this.afterRowsOperation()
  }

  /**
   * 批量删除多行
   * @param indexes 要删除的行索引数组，会自动按从大到小排序处理
   */
  deleteRows(indexes: number[]) {
    if (this.checkEditing()) return

    this.subscription.setValue(
      produce((draft) => {
        // 从大到小排序,避免删除时索引变化
        indexes
          .sort((a, b) => b - a)
          .forEach((idx) => {
            if (idx >= 0 && idx < draft.length) {
              draft.splice(idx, 1)
            }
          })
      })
    )
    this.afterRowsOperation()
  }

  /**
   * 复制指定行
   * @param sourceIndex 要复制的行索引
   * @param options 复制选项
   * @param options.targetIndex 目标位置索引，可选，默认复制到原位置的下一行
   * @param options.rowKey 行数据中用于标识唯一性的字段名，默认为 'id'
   */
  copyRow(sourceIndex: number, options?: { targetIndex?: number; rowKey?: string }) {
    if (this.checkEditing()) return

    const sourceRow = this.getRow(sourceIndex)
    if (!sourceRow) return

    // 使用 lodash 的 cloneDeep 进行深拷贝，避免引用问题
    const copiedRow = cloneDeep(sourceRow)

    // 生成新的唯一 ID
    const rowKey = options?.rowKey ?? 'id'
    const newId = 'copiedRow_' + uuid()
    set(copiedRow, rowKey, newId)

    // 如果没有指定目标位置，默认复制到原位置的下一行
    const insertIndex = options?.targetIndex ?? sourceIndex + 1

    // 复用 addRow 方法，保持 targetIndex 逻辑一致
    this.addRow(copiedRow, insertIndex)
  }

  /**
   * 交换两行位置
   * @param sourceIndex 源行索引
   * @param targetIndex 目标行索引
   */
  swapRow(sourceIndex: number, targetIndex: number) {
    if (this.checkEditing()) return

    let hasOperated = false
    this.subscription.setValue(
      produce((draft) => {
        if (
          sourceIndex >= 0 &&
          sourceIndex < draft.length &&
          targetIndex >= 0 &&
          targetIndex < draft.length &&
          sourceIndex !== targetIndex
        ) {
          const temp = draft[sourceIndex]
          draft[sourceIndex] = draft[targetIndex]
          draft[targetIndex] = temp
          hasOperated = true
        }
      })
    )
    if (hasOperated) this.afterRowsOperation()
  }

  /**
   * 移动行到指定位置
   * @param sourceIndex 要移动的行索引
   * @param targetIndex 目标位置索引
   */
  moveRow(sourceIndex: number, targetIndex: number) {
    if (this.checkEditing()) return

    let hasOperated = false
    this.subscription.setValue(
      produce((draft) => {
        if (
          sourceIndex >= 0 &&
          sourceIndex < draft.length &&
          targetIndex >= 0 &&
          targetIndex < draft.length &&
          sourceIndex !== targetIndex
        ) {
          const [movedItem] = draft.splice(sourceIndex, 1)
          draft.splice(targetIndex, 0, movedItem)
          hasOperated = true
        }
      })
    )
    if (hasOperated) this.afterRowsOperation()
  }

  /**
   * 获取当前所有数据
   * @returns 当前表格的所有行数据
   */
  getData() {
    return this.subscription.getValue()
  }

  /**
   * 获取指定行数据
   * @param index 行索引
   * @returns 指定行的数据，如果索引无效则返回 undefined
   */
  getRow(index: number) {
    const data = this.subscription.getValue()
    return index >= 0 && index < data.length ? data[index] : undefined
  }

  /**
   * 开始编辑指定行
   * @param index 要编辑的行索引
   */
  startEdit(index: number) {
    if (index < 0 || index >= this.subscription.getValue().length) return

    // 如果已经在编辑其他行,先取消之前的编辑
    if (this.editingIndex !== null && this.editingIndex !== index) {
      this.cancelEdit()
    }

    this.editingIndex = index

    if (this.editingSubscription) {
      this.editingSubscription.setValue({ [index]: true })
    }
  }

  /**
   * 保存当前编辑行的修改
   */
  saveEdit() {
    if (this.editingIndex === null) return

    const editingIndex = this.editingIndex
    this.editingIndex = null

    const result = this.subscription.saveDraft()
    if (result) {
      this.propsRef?.current.onValuesChange?.(result.changedValues, result.allValues)
    }

    // 清除编辑状态
    if (this.editingSubscription) {
      this.editingSubscription.setValue({ [editingIndex]: false })
    }
  }

  /**
   * 取消当前行的编辑,还原数据
   */
  cancelEdit() {
    if (this.editingIndex === null) return

    const editingIndex = this.editingIndex

    // 清除暂存的草稿
    this.subscription.clearDraft()
    this.editingIndex = null

    // 清除编辑状态
    if (this.editingSubscription) {
      this.editingSubscription.setValue({ [editingIndex]: false })
    }
  }

  /**
   * 判断指定行是否处于编辑状态
   * @param index 行索引
   */
  isRowEditing(index: number): boolean {
    return this.editingIndex === index
  }

  /**
   * 获取当前正在编辑的行索引
   */
  getEditingIndex(): number | null {
    return this.editingIndex
  }
}

export type { TableRowController as TableRowControllerType }

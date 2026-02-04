import { Schedular } from '@hi-ui/schema-utils'
import { BatchDepUpdate } from '@hi-ui/schema-fields'
import { generateDepPropsField } from '@hi-ui/schema-form' // 依赖一个form的内部函数
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { Subscription } from '@hi-ui/use-subscription'
import type { EditableCaseProps } from '@hi-ui/schema-fields'

type ExecCellDepsCtxType<TData extends AnyObject = AnyObject> = {
  /**
   * 可编辑场景的组件属性
   * - 所有的操作都围绕着它展开
   */
  fieldProps: EditableCaseProps
  /** 当前行数据 */
  rowData: TData
  /** 当前行索引 */
  rowIndex: number
  /** 当前字段的数据键 */
  dataKey: string
  /** 变更的依赖值映射（按行索引） */
  changedDepValues: Record<number, Partial<TData>>
  /** 变更的字段名列表 */
  changedFieldNames: string[] | undefined
  /** 表格订阅对象 */
  tableValue: Subscription<AnyObject[]>
}

export function execCellDepsProcess<TData extends AnyObject>(ctx: ExecCellDepsCtxType<TData>) {
  // 直接先处理值依赖
  execCellValueDepFn(ctx)

  // 再处理 Props 依赖
  execCellPropsDepFn(ctx)
}

/**
 * Props依赖处理的上下文类型
 */
export interface PropsDependencyContext<TData extends AnyObject = AnyObject> {
  /** 字段配置 */
  field: FieldConfigType<TData>
  /** 依赖值 */
  depValues: Partial<TData>
  /** 所有值 */
  allValues: TData
  /** 变更的依赖键列表 */
  changedDepKeys: string[]
  /** 表单引用 */
  formRef: AnyType
}

/**
 * 处理表格单元格中的值依赖逻辑
 */
export function execCellValueDepFn<TData extends AnyObject>(ctx: ExecCellDepsCtxType<TData>) {
  const { fieldProps } = ctx
  const { field } = fieldProps

  // 检查字段是否有依赖配置
  if (!field.dependency) return // 没有配置依赖，直接退出

  const { deps, value: depValueFn } = field.dependency
  if (!deps.length || !depValueFn) return // 没有依赖或依赖函数，直接退出

  const { rowIndex, changedDepValues } = ctx
  const currentDepValues = changedDepValues[rowIndex]

  // 依赖值不存在，直接退出
  if (!currentDepValues) return

  // 检查依赖的字段是否存在于当前变更的值上
  // NOTE 此处仅检测了第一层的属性，暂时不支持嵌套属性的情况
  const hasChanged = deps.some((name) => name in (currentDepValues || {}))

  // 依赖字段变更，才需要执行 depValueFn
  if (!hasChanged) return

  const { rowData, dataKey, changedFieldNames, tableValue } = ctx

  const nextValue = depValueFn(currentDepValues, {
    allValues: rowData,
    changedDepKeys: (changedFieldNames || []) as string[],
    rowIndex,
    dataKey,
    formRef: { current: null }, // TODO 待更新实现
    batchUpdate: BatchDepUpdate.update,
  })

  const finalValue = BatchDepUpdate.getValues<TData>(dataKey, nextValue)
  const { [dataKey]: fieldValue, ...restDepValues } = finalValue

  // 关键赋值
  fieldProps.value = fieldValue
  fieldProps.ctx.formBinding.value = fieldValue

  // 还要合并到 TableValue 上，但是不再触发订阅
  tableValue.mergeSilently({ [rowIndex]: { [dataKey]: nextValue } as Partial<TData> })

  // 存在批量更新的值时，一并写到 TableValue 上，并且触发订阅
  Schedular.nextMicro(() => {
    tableValue.mergeValue({ [rowIndex]: restDepValues as Partial<TData> })
  })
}

/**
 * 处理表格单元格中的 Props 依赖逻辑
 */
export function execCellPropsDepFn<TData extends AnyObject>(ctx: ExecCellDepsCtxType<TData>) {
  const nextField = generateDepPropsField(ctx.fieldProps.field, {
    formRef: {} as AnyType,
    depValues: ctx.changedDepValues[ctx.rowIndex] as Pick<TData, keyof TData>,
    changedDepKeys: ctx.changedFieldNames || [],
    allValues: ctx.rowData,
  })

  ctx.fieldProps.field = nextField as FieldConfigType
  ctx.fieldProps.ctx.field = nextField as FieldConfigType
}

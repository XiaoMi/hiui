import { useEffect } from 'react'
import { useLatest } from 'ahooks'
import { get, set } from 'lodash-es'
import { useRefState } from '@hi-ui/use-ref-state'
import type { Subscription } from './class'

export type ArrayPathInput<Data> = [number, keyof Data]

export type ListSubscribeResult<Data extends AnyObject = AnyObject> = {
  /**
   * 完整的依赖的值，嵌套结构
   * @desc 依赖 `[0, 'name'], [1, 'age']`
   * @desc 变化 `[0, 'name']`
   * @desc 则 allDepValues 为 `{ 0: { name: 'John', age: 20 }, 1: { name: 'Jane', age: 25 } }`
   */
  allDepValues: Record<number, Partial<Data>>
  /**
   * 变化的路径，保持字符串格式
   * @desc 依赖 `[0, 'name'], [1, 'age']`
   * @desc 变化 `[0, 'name']`
   * @desc 则 changedDepPaths 为 `[[0, 'name']]`
   */
  changedDepPaths: ArrayPathInput<Data>[]
  /**
   * 变化的值，嵌套结构
   * @desc 依赖 `[0, 'name'], [1, 'age']`
   * @desc 变化 `[0, 'name']`
   * @desc 则 changedDepValues 为 `{ 0: { name: 'John' } }`
   */
  changedDepValues: Record<number, Partial<Data>>

  /**
   * 仅当只依赖一行数据时，返回所有的、不包含行索引的值
   * @desc 依赖 `[0, 'name'], [0, 'age']`
   * @desc 则 allFieldValues 为 `{ name: 'John', age: 20 }`
   */
  allFieldValues?: Partial<Data>
  /**
   * 仅当只依赖一行数据时，返回变化的、不包含行索引的字段名称
   * @desc 依赖 `[0, 'name'], [0, 'age']`
   * @desc 变化 `[0, 'name']`
   * @desc 则 changedFieldNames 为 `['name']`
   */
  changedFieldNames?: (keyof Data)[]
  /**
   * 仅当只依赖一行数据时，返回变化的、不包含行索引的值
   * @desc 依赖 `[0, 'name'], [0, 'age']`
   * @desc 变化 `[0, 'name']`
   * @desc 则 changedFieldValues 为 `{ name: 'John' }`
   */
  changedFieldValues?: Partial<Data>

  /**
   * deps 存在时，返回第一个依赖的值
   * @desc 依赖 `[0, 'name'], [0, 'age'], [1, 'age']`,
   * @desc 则 fieldValue 始终为 `John`
   * @desc 通常在仅依赖一个单元格数据时，用来获取单元格最新的值
   * @desc 或者在依赖多个字段时，认为第一个依赖是当前单元格的数据
   * @desc 其余时候为上述情况的额外概念扩充，仅作保留，值不一定有用
   */
  fieldValue?: unknown
}

export type ListSubscribeExtraOpts = {
  /**
   * 是否跳过订阅
   * @desc 默认情况下，列表会为每一个单元格创建监听，但对只读的单元格则有些多余
   * @desc 因此可以设置此选项，跳过对只读单元格的监听
   * @desc 不要觉得这里是多余的，之所以在这里设置，是为了保持外部调用时的一致性
   */
  skipSubscribe?: boolean

  /**
   * 是否从 draft 中获取值
   * @desc 默认情况下，列表会从 allDepValues 中获取值，但有时需要从 draft 中获取值
   * @desc 例如在行编辑模式下，就需要从 draft 中获取值
   */
  getFieldValueFromDraft?: boolean
}

export function useSubscribeList<T extends Data[], Data extends AnyObject = AnyObject>(
  subscription: Subscription<T>,
  deps?: ArrayPathInput<Data>[],
  extraOpts?: ListSubscribeExtraOpts
): ListSubscribeResult<Data> {
  const depsRef = useLatest(deps)

  const [valueRef, setValueRef] = useRefState<ListSubscribeResult<Data>>(() => {
    const allValues = subscription.getValue()
    if (!deps) {
      return {
        allDepValues: allValues,
        changedDepPaths: [],
        changedDepValues: {},
      }
    }

    const allDepValues = deps.reduce((acc, path) => {
      set(acc, path, get(allValues, path))
      return acc
    }, {} as Record<number, Partial<Data>>)

    return {
      allDepValues,
      changedDepPaths: [],
      changedDepValues: {},
    }
  })

  useEffect(() => {
    // 跳过订阅
    if (extraOpts?.skipSubscribe) {
      return () => {
        // empty placeholder
      }
    }

    return subscription.subscribe(
      (notification) => {
        const { value: newValue, changedValues } = notification

        const dftPayload: ListSubscribeResult<Data> = {
          allDepValues: newValue,
          changedDepPaths: [],
          changedDepValues: {},
        }

        // 不论如何
        // 只要收到订阅更新，就更新 valueRef
        // 但不主动触发重渲染
        valueRef.current = dftPayload

        // 静默更新时，不再执行
        if (notification.extra?.silent) return

        if (!depsRef.current) {
          setValueRef(dftPayload)
          return
        }

        // TS类型推断不太对，在这里加一个别名，没有别的实际意义
        const thisDeps = depsRef.current

        // 过滤出依赖的变化路径
        const changedDepPaths = thisDeps.filter((path) => get(changedValues, path) !== undefined)

        if (changedDepPaths.length > 0) {
          const changedDepValues = changedDepPaths.reduce((acc, path) => {
            set(acc, path, get(changedValues, path))
            return acc
          }, {} as Record<number, Partial<Data>>)

          const allDepValues = thisDeps.reduce((acc, path) => {
            set(acc, path, get(newValue, path))
            return acc
          }, {} as Record<number, Partial<Data>>)

          const nextPayload: ListSubscribeResult<Data> = {
            allDepValues,
            changedDepPaths,
            changedDepValues,
          }

          // 检查是否只依赖单行数据
          const rowIndices = new Set(thisDeps.map(([index]) => index))
          if (rowIndices.size === 1) {
            const rowIndex = Array.from(rowIndices)[0]
            nextPayload.allFieldValues = allDepValues[rowIndex]
            nextPayload.changedFieldNames = changedDepPaths
              .filter(([index]) => index === rowIndex)
              .map(([, fieldKey]) => fieldKey)
            nextPayload.changedFieldValues = changedDepValues[rowIndex]
          }

          setValueRef(nextPayload)
        }
      },
      {
        // 使用路径订阅，避免广播给数量众多的末端订阅者
        path: depsRef.current ?? undefined,
      }
    )
  }, [subscription, depsRef, valueRef, setValueRef, extraOpts?.skipSubscribe])

  // deps 存在时，返回第一个依赖的值
  // 例如依赖`[0, 'name'], [0, 'age'], [1, 'age']`, 则返回 John
  if (depsRef.current && depsRef.current.length >= 1) {
    valueRef.current.fieldValue = get(valueRef.current.allDepValues, depsRef.current[0])

    // 满足条件，则尝试从 draft 中获取值
    if (extraOpts?.getFieldValueFromDraft) {
      const draftValue = get(subscription.getDraft(), depsRef.current[0])
      valueRef.current.fieldValue = draftValue ?? valueRef.current.fieldValue
    }
  }

  return valueRef.current
}

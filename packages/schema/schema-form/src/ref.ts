import React, { useEffect, useRef } from 'react'
import { set, cloneDeep } from 'lodash-es'
import { patchValues, Schedular } from '@hi-ui/schema-utils'
import type { FormHelpers } from '@hi-ui/form'
import type { PatchType } from '@hi-ui/schema-utils'
import type { SchemaFormCtxType } from './ctx'

// @doc-comment-start code-block
// ---
// title: EnhancedFormHelpers
// api:
//   for: form.basic
//   order: 20
// ---
export type EnhancedFormHelpers<TData extends AnyObject = AnyObject> = Omit<
  FormHelpers<TData>,
  'getFieldsValue' | 'setFieldValue' | 'setFieldsValue'
> & {
  /**
   * 获取所有字段的值
   * @desc 返回值为 Partial<T>，即部分字段可能还没有值
   * @desc 本质是 FormHelpers.getFieldsValue 的类型增强包装
   */
  getFieldsValue: () => Partial<TData>
  /**
   * 强制重置表单
   * @desc 与 reset 的区别在于，reset 无法正确清除 select 的值
   * @desc forceReset 则会取出全部字段的值，按照预定类型进行重置
   * @desc 规则为：Object:null; Array:[]; String:''; Number:0; Boolean:null
   */
  forceReset: () => void
  /**
   * 强制重置单个表单字段
   */
  forceResetField: (field: Parameters<FormHelpers['getFieldValue']>[0]) => void
  /**
   * 设置单个表单字段值
   * @desc 本质是 FormHelpers.setFieldValue 的增强和适配包装
   */
  setFieldValue: (...args: Parameters<FormHelpers['setFieldValue']>) => void
  /**
   * 异步执行 setFieldValue
   * @desc 内部使用 Promise.resolve 延迟执行
   * @desc 主要目的是防止部分情况下 Form 正在渲染时调用 setFieldsValue 导致的警告或者报错
   */
  setFieldValueAsync: (...args: Parameters<FormHelpers['setFieldValue']>) => void
  /**
   * 设置表单字段值
   * @desc 本质是 FormHelpers.setFieldsValue 的增强和适配包装
   */
  setFieldsValue: (values: Partial<TData & AnyObject>) => void
  /**
   * 异步执行 setFieldsValue
   * @desc 内部使用 Promise.resolve 延迟执行
   * @desc 主要目的是防止部分情况下 Form 正在渲染时调用 setFieldsValue 导致的警告或者报错
   */
  setFieldsValueAsync: (values: Partial<TData & AnyObject>) => void
  /**
   * 合并字段值
   * - 功能与 FormHelpers.setFieldsValue 类似，但处理对象值时会【合并字段值】而非直接替换
   * - 主要目的是为了复杂对象字段在依赖字段变化时，能够正确地合并字段值
   */
  mergeFieldsValue: (values: Partial<TData & AnyObject>) => void
  /**
   * 静默且异步合并字段值
   * - 功能与 mergeFieldsValue 类似，但不会触发订阅更新
   */
  mergeFieldsValueSilently: (values: Partial<TData & AnyObject>) => void
}
// @doc-comment-end code-block

/** 对外暴露的增强表单实例类型 */
export type EnhancedFormRefType<TData extends AnyObject = AnyObject> = React.RefObject<
  EnhancedFormHelpers<TData>
>

export function useFormRef<TData extends AnyObject = AnyObject>(
  props: Pick<SchemaFormCtxType<TData>, 'formValue' | 'setTickState'>
) {
  const { formValue, setTickState } = props

  // {} as unknown as null 的目的在于
  // {} 是给 formRef 一个初始空对象，方便后面合并新值进去
  // null 是使类型能够推断为 React.RefObject<EnhancedFormHelpers>
  const formRef = useRef<EnhancedFormHelpers<TData>>({} as unknown as null)
  const innerFormRef = useRef<FormHelpers<TData>>(null)

  // 创建增强的表单实例
  useEffect(() => {
    function setFieldValue(...args: Parameters<FormHelpers['setFieldValue']>) {
      innerFormRef.current?.setFieldValue(...args)
      // args[0] 为数据索引，args[1] 为字段值
      const payload = set({}, args[0], args[1])
      formValue.mergeValue(payload as PatchType<TData>)
    }

    const enhancedFormHelpers = patchValues(
      // 相当于直接修改 formRef.current 初始赋给的空对象
      formRef.current as EnhancedFormHelpers,
      // 合并内部表单实例
      innerFormRef.current || ({} as FormHelpers),
      // 合并增强的表单方法
      {
        getFieldsValue(...args) {
          return innerFormRef.current?.getFieldsValue(...args)
        },
        forceReset() {
          const values = innerFormRef.current?.getFieldsValue()
          if (values) {
            const nextValue = Object.keys(values).reduce(
              (acc, key) => ({ ...acc, [key]: genDftValue(values[key]) }),
              {} as AnyObject
            )
            innerFormRef.current?.setFieldsValue(nextValue)
          }
        },
        forceResetField(field) {
          const curValue = innerFormRef.current?.getFieldValue(field)
          const nextValue = genDftValue(curValue)
          innerFormRef.current?.setFieldValue(field, nextValue)
        },
        setFieldValue(...args) {
          setFieldValue(...args)
        },
        setFieldValueAsync(...args) {
          // 异步执行 setFieldValue
          Schedular.nextMicro(() => setFieldValue(...args))
        },
        setFieldsValue(values) {
          innerFormRef.current?.setFieldsValue(values)
          formValue.mergeValue(values as PatchType<TData>)
          setTickState() // 其他的后面酌情再加吧，这次是为了让只读元素响应 setFieldsValue 的更新
        },
        setFieldsValueAsync(values) {
          // 异步执行 setFieldsValue
          Schedular.nextMicro(() => {
            innerFormRef.current?.setFieldsValue(values)
            formValue.mergeValue(values as PatchType<TData>)
          })
        },
        mergeFieldsValue(values) {
          if (!values) return
          if (typeof values !== 'object') return

          const allValues = innerFormRef.current?.getFieldsValue() as Partial<TData>
          const nextValues = mergeFieldsValue(allValues, values) as PatchType<TData>

          innerFormRef.current?.setFieldsValue(nextValues)
          formValue.mergeValue(nextValues)
        },
        mergeFieldsValueSilently: (values) => {
          if (!values) return
          if (typeof values !== 'object') return

          const allValues = innerFormRef.current?.getFieldsValue() as Partial<TData>
          const nextValues = mergeFieldsValue(allValues, values) as PatchType<TData>

          Schedular.nextMicro(() => {
            innerFormRef.current?.setFieldsValue(nextValues)
            formValue.mergeValue(nextValues)
          })
        },
        // NOTE 此处是为了规避 validate 内部取值的闭包问题，待 HiUI 底层修复后，可直接移除
        validate(...args) {
          return innerFormRef.current?.validate(...args)
        },
      } as EnhancedFormHelpers
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 此处需要明确赋值 // 更新内部 formRef
    formRef.current = enhancedFormHelpers
  }, [formValue, setTickState])

  return {
    /** 对外暴露的增强表单实例 */
    formRef,
    /** 底层 HiUI 的内部表单实例 */
    innerFormRef,
  }
}

function genDftValue(value: unknown) {
  if (!value) return value

  return {
    Object: null,
    Array: [],
    String: '',
    Number: 0,
    Boolean: null,
    Date: null,
  }[Object.prototype.toString.call(value).slice(8, -1)]
}

export function mergeFieldsValue(beforeValue: unknown, incomingValue: unknown) {
  // 之前字段值为 nil 则直接赋值
  if (beforeValue === null || beforeValue === undefined) return incomingValue
  // 传入 null 则返回 null
  if (incomingValue === null) return null
  // 传入 undefined 则返回之前字段值
  if (incomingValue === undefined) return beforeValue

  // 处理数组特殊情况
  if (Array.isArray(beforeValue) && Array.isArray(incomingValue)) {
    // 创建合并后的新数组
    const nextValues = [] as unknown[]

    // 遍历两个数组中较长的那个
    const maxLength = Math.max(beforeValue.length, incomingValue.length)
    for (let idx = 0; idx < maxLength; idx++) {
      const _beforeValue = beforeValue[idx]
      const _incomingValue = incomingValue[idx]
      nextValues[idx] = mergeFieldsValue(_beforeValue, _incomingValue)
    }

    return nextValues
  }

  // 如果其中一个值是数组，则直接返回新值
  if (Array.isArray(beforeValue) || Array.isArray(incomingValue)) return incomingValue

  // 都是对象则按照对象合并，不会修改原对象
  if (typeof beforeValue === 'object' && typeof incomingValue === 'object') {
    const nextValues = cloneDeep(beforeValue) as Record<string, unknown>
    for (const key in incomingValue) {
      const _beforeValue = beforeValue[key as keyof typeof beforeValue]
      const _incomingValue = incomingValue[key as keyof typeof incomingValue]
      nextValues[key] = mergeFieldsValue(_beforeValue, _incomingValue)
    }

    return nextValues
  }

  // 其他情况直接赋值
  return incomingValue
}

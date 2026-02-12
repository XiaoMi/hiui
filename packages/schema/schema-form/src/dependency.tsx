import { useMemo } from 'react'
import { useSubscribe } from '@hi-ui/use-subscription'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { SchemaFormCtxType } from './ctx'

// 会在必要时修改字段
function validateDependency(field: FieldConfigType): void {
  if (!field.dependency) return

  // 检查是否有 deps
  if (!field.dependency.deps || !field.dependency.deps.length) {
    console.error(
      'validateFormDependency',
      `字段 ${field.key} 的 dependency 配置缺少必需的 deps 属性，且至少需要一个依赖字段`
    )
    return
  }

  // 如果配置了 fields，则不能同时配置 value 或 props
  if (field.dependency.fields) {
    if (field.dependency.value || field.dependency.props) {
      // 直接清除不兼容的 value 和 props
      field.dependency.value = undefined
      field.dependency.props = undefined

      console.error(
        'validateFormDependency',
        `字段 ${field.key} 的 dependency 配置错误: fields 不能与 value 或 props 同时使用`
      )
    }
  }
}

export function useFieldsDependency<TData extends AnyObject = AnyObject>(
  fields: FieldConfigType[],
  formCtx: SchemaFormCtxType<TData>
) {
  const { formValue } = formCtx

  // 收集所有依赖字段
  const { deps } = useMemo(() => {
    const depsMap = new Map<string, string[]>()

    fields.forEach((field) => {
      validateDependency(field) // 添加校验 // 会在必要时修改字段

      if (field.dependency?.deps && !!field.dependency.deps.length && !!field.dependency?.fields) {
        depsMap.set(field.key, field.dependency.deps)
      }
    })

    const deps = Array.from(new Set(Array.from(depsMap.values()).flat()))

    return { deps }
  }, [fields])

  // 订阅依赖值变化
  const result = useSubscribe(formValue, deps)

  return { deps, result }
}

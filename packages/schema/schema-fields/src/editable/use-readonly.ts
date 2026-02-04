import type { FieldConfigType } from '@hi-ui/schema-core'
import { useEditableControlCtx } from './ctx'
import type { DynamicEditableCtxType } from './type'

type ReadonlyCtrlType = Partial<Record<'editable' | 'readonly', boolean>>

type ReadonlyCtxType = {
  component: ReadonlyCtrlType
  field: ReadonlyCtrlType
  runtimeEditable?: boolean
}

/**
 * 判断字段是否只读
 * @param field 字段配置
 * @param runtimeEditable 运行时的可编辑状态(可选)
 */
export function useReadonly(field: FieldConfigType, runtimeEditable?: boolean) {
  const component = useEditableControlCtx()
  return isReadonly({ component, field: field.control || {}, runtimeEditable })
}

// 是否只读的判断逻辑：
// - 影响这个值的有四个属性 组件层级的 'editable' | 'readonly' 和字段层级的 'editable' | 'readonly'
// - 先看外部的配置，再看内部的配置，内部的优先级更高
// - 这四个值，是 undefined 的直接忽略
// - 默认是可编辑的，只有在 readonly 为 true 或者 editable 为 false 时 才会不可编辑
// - 如果 readonly 和 editable 有冲突，editable 的优先级更高

// NOTE 其实完全可以使用一个值来表示，但是为了方便写代码，还是分开两个字段来控制

/**
 * 判断是否只读的工具函数
 */
export function isReadonly(ctx: ReadonlyCtxType) {
  const { component, field, runtimeEditable } = ctx

  // 检查字段级别的 editable
  if (field.editable !== undefined) {
    return !field.editable
  }

  // 检查字段级别的 readonly
  if (field.readonly !== undefined) {
    return field.readonly
  }

  // 检查运行时配置
  if (runtimeEditable !== undefined) {
    return !runtimeEditable
  }

  // 检查组件级别的 editable
  if (component.editable !== undefined) {
    return !component.editable
  }

  // 检查组件级别的 readonly
  if (component.readonly !== undefined) {
    return component.readonly
  }

  // 默认可编辑
  return false
}

/**
 * 运行动态可编辑函数
 * - 会在字段内部完成【只读/可编辑/运行时可编辑】的判断后执行
 * - 仅在上述判断为【可编辑】时，才会调用本函数
 * - 本函数返回真值时，字段开启编辑，否则改为只读
 */
export function runDynamicEditable(
  field: FieldConfigType,
  readonly: boolean,
  getCtx: () => DynamicEditableCtxType
) {
  // 只读直接返回false
  if (readonly) return false
  // 以下字段是可编辑的

  // 再检查 dynamicEditable 函数
  const dynamicEditable = field.control?.dynamicEditable
  // 不存在，就保持可编辑
  if (!dynamicEditable) return true

  try {
    // 存在，就调用函数
    const ctx = getCtx()
    return !!dynamicEditable(ctx)
  } catch (error) {
    console.warn('runDynamicEditable', error)
    // 如果函数抛出错误，就保持可编辑
    return true
  }
}

// NOTE 以下是 isReadonly 的测试代码

// // 创建测试上下文的辅助函数
// const createCtx = (config: {
//   componentEditable?: boolean
//   componentReadonly?: boolean
//   fieldEditable?: boolean
//   fieldReadonly?: boolean
//   runtimeEditable?: boolean
// }) => {
//   return {
//     component: { editable: config.componentEditable, readonly: config.componentReadonly },
//     field: { editable: config.fieldEditable, readonly: config.fieldReadonly },
//     runtimeEditable: config.runtimeEditable,
//   }
// }

// // 测试辅助函数
// function runTest(description: string, ctx: ReadonlyCtxType, expectedResult: boolean) {
//   const actualResult = isReadonly(ctx)
//   const passed = actualResult === expectedResult
//   console.log(
//     `${passed ? '✅' : '❌'} ${description}\n`,
//     `  预期结果: ${expectedResult}\n`,
//     `  实际结果: ${actualResult}\n`
//   )
// }

// console.log('=== isReadOnly 函数测试 ===\n')

// // 默认行为测试
// console.log('📋 测试组：默认行为\n')
// runTest('所有配置都是undefined时应该可编辑', createCtx({}), false)

// // 运行时配置测试
// console.log('\n📋 测试组：运行时配置\n')
// runTest('runtimeEditable=false 时应该只读', createCtx({ runtimeEditable: false }), true)
// runTest('runtimeEditable=true 时应该可编辑', createCtx({ runtimeEditable: true }), false)

// // 组件级别配置测试
// console.log('\n📋 测试组：组件级别配置\n')
// runTest('componentEditable=false 时应该只读', createCtx({ componentEditable: false }), true)
// runTest('componentEditable=true 时应该可编辑', createCtx({ componentEditable: true }), false)
// runTest('componentReadonly=true 时应该只读', createCtx({ componentReadonly: true }), true)
// runTest('componentReadonly=false 时应该可编辑', createCtx({ componentReadonly: false }), false)
// runTest(
//   'componentEditable=false 且 componentReadonly=false 时应该只读(editable优先)',
//   createCtx({ componentEditable: false, componentReadonly: false }),
//   true
// )

// // 字段级别配置测试
// console.log('\n📋 测试组：字段级别配置\n')
// runTest('fieldEditable=false 时应该只读', createCtx({ fieldEditable: false }), true)
// runTest('fieldEditable=true 时应该可编辑', createCtx({ fieldEditable: true }), false)
// runTest('fieldReadonly=true 时应该只读', createCtx({ fieldReadonly: true }), true)
// runTest('fieldReadonly=false 时应该可编辑', createCtx({ fieldReadonly: false }), false)

// // 运行时与字段配置组合测试
// console.log('\n📋 测试组：运行时与字段配置组合\n')
// runTest(
//   '字段 editable=false 时 runtimeEditable=true 不应生效',
//   createCtx({ fieldEditable: false, runtimeEditable: true }),
//   true
// )
// runTest(
//   '字段 readonly=true 时 runtimeEditable=true 不应生效',
//   createCtx({ fieldReadonly: true, runtimeEditable: true }),
//   true
// )

// // 运行时与组件配置组合测试
// console.log('\n📋 测试组：运行时与组件配置组合\n')
// runTest(
//   'runtimeEditable=false 应覆盖组件 editable=true',
//   createCtx({ componentEditable: true, runtimeEditable: false }),
//   true
// )
// runTest(
//   'runtimeEditable=true 应覆盖组件 readonly=true',
//   createCtx({ componentReadonly: true, runtimeEditable: true }),
//   false
// )

// // 复杂组合场景测试
// console.log('\n📋 测试组：复杂组合场景\n')
// runTest(
//   '字段配置优先：字段readonly=true时其他配置都不生效',
//   createCtx({
//     fieldReadonly: true,
//     runtimeEditable: true,
//     componentEditable: true,
//   }),
//   true
// )
// runTest(
//   'runtime配置次之：无字段配置时runtime覆盖组件配置',
//   createCtx({
//     runtimeEditable: true,
//     componentReadonly: true,
//   }),
//   false
// )
// runTest(
//   '字段级editable优先级最高：fieldEditable=true时覆盖其他所有配置',
//   createCtx({
//     fieldEditable: true,
//     fieldReadonly: true,
//     runtimeEditable: false,
//     componentEditable: false,
//     componentReadonly: true,
//   }),
//   false
// )

// console.log('\n=== 测试结束 ===')

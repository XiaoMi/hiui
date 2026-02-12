import { mergeWith, isNil } from 'lodash-es'

// 数组类型的重载
export function patchValues<T extends AnyObject>(
  source: T[],
  ...patches: (Record<number, Partial<T>> | undefined)[]
): T[]
// 对象类型的重载
export function patchValues<T extends AnyObject>(
  source: T,
  ...patches: (Partial<T> | undefined)[]
): T
/**
 * 合并对象或数组,会修改原始值
 * @param source 源对象或数组
 * @param patches 要合并的补丁对象或数组
 * @returns 合并后的对象或数组(修改后的source)
 *
 * @example
 * // 对象合并
 * const obj = { a: 1 }
 * patchValues(obj, { b: 2 }) // { a: 1, b: 2 }
 *
 * // 数组合并
 * const arr = [{ id: 1 }]
 * patchValues(arr, { 0: { name: 'a' } }) // [{ id: 1, name: 'a' }]
 */
export function patchValues(source: unknown, ...patches: unknown[]): unknown {
  return mergeWith(source, ...patches, (_: unknown, b: unknown) => {
    return Array.isArray(b) ? b : undefined
  })
}

/**
 * 合并多个对象的属性
 * @param props 要合并的对象列表,支持 undefined
 * @returns 合并后的新对象
 *
 * @example
 * const obj1 = { a: 1 }
 * const obj2 = { b: 2 }
 * mergeProps(obj1, obj2) // { a: 1, b: 2 }
 */
export function mergeProps<T extends AnyObject>(...props: (T | undefined)[]) {
  return patchValues({} as T, ...props)
}

/**
 * 合并多个数组
 * @param props 要合并的数组列表,支持 undefined
 * @returns 合并后的新数组
 *
 * @example
 * const arr1 = [{ id: 1, name: 'a' }]
 * const arr2 = [{ name: 'b' }]
 * mergeList(arr1, arr2) // [{ id: 1, name: 'b' }]
 */
export function mergeList<T extends AnyType[]>(...props: (T | undefined)[]) {
  return patchValues([], ...props) as unknown as T
}

/**
 * 补丁类型
 * - 用于描述部分更新时的数据类型
 *
 * @description
 * - 数组类型: 转换为索引对象,key为索引,value为元素的部分属性
 *   - 支持 number 和 string 类型的索引
 *   - 元素类型会被 Partial 包装,支持部分属性更新
 * - 对象类型: 转换为原对象的 Partial 类型
 * - 原始类型(number/string/boolean等):
 *   - 补丁类型对原始类型无效
 *   - 会直接使用新值替换原值
 *
 * @example
 * // 数组补丁
 * type User = { id: number, name: string, age: number }
 * type UserArray = User[]
 * type UserPatch = PatchType<UserArray>
 * // 结果: Record<number|string, Partial<User>>
 * const patch: UserPatch = {
 *   0: { age: 20 }, // 更新第一个元素的 age
 *   1: { name: 'new name' } // 更新第二个元素的 name
 * }
 *
 * // 对象补丁
 * type Config = { debug: boolean, port: number, host: string }
 * type ConfigPatch = PatchType<Config>
 * // 结果: Partial<Config>
 * const patch: ConfigPatch = {
 *   port: 3000, // 只更新 port
 *   host: 'localhost' // 只更新 host
 * }
 *
 * // 原始类型
 * type NumPatch = PatchType<number> // Partial<number> = number
 * const patch: NumPatch = 2 // 直接替换原值
 */
export type PatchType<T> = T extends AnyType[]
  ? Record<number | string, Partial<T[number]>>
  : DeepPartial<T>

/**
 * 通用的值合并函数,可以处理原始类型、数组和对象。
 * @param values - 要合并的值列表
 * - undefined/null 值会被过滤掉
 * - 支持混合传入不同类型的值,但建议保持类型一致
 *
 * @description
 * - 原始类型(number/string/boolean): 返回最后一个非空值
 * - 数组: 支持两种合并模式
 *   1. 数组与数组合并: 按位置合并数组元素
 *      - 普通元素: 后面的元素替换前面的元素
 *      - 对象元素: 递归合并对象属性
 *   2. 数组与对象合并(patch模式): 通过索引对象更新数组元素
 *      - 对象的key为数组索引,value为要合并的内容
 *      - 只会更新指定索引位置的元素
 * - 对象: 递归合并所有属性
 *
 * @returns
 * - 如果所有值都是 undefined/null,返回 undefined
 * - 原始类型: 返回最后一个非空值
 * - 数组: 返回合并后的新数组
 * - 对象: 返回合并后的新对象
 *
 * @example
 * // 原始类型
 * mergeValues(1, undefined, 2) // 返回 2
 *
 * // 数组与数组合并
 * mergeValues([1, 2], [3], [4, 5]) // 返回 [4, 5]
 * mergeValues(
 *   [{id: 1, name: 'a'}],
 *   [{id: 1, age: 20}]
 * ) // 返回 [{id: 1, name: 'a', age: 20}]
 *
 * // 数组与对象合并(patch模式)
 * mergeValues(
 *   [
 *     { id: 1, name: 'a' },
 *     { id: 2, name: 'b' },
 *   ],
 *   { 1: { age: 20 } }
 * ) // 返回 [{id: 1, name: 'a'}, {id: 2, name: 'b', age: 20}]
 *
 * // 对象合并
 * mergeValues(
 *   {a: 1, b: 2},
 *   {b: 3, c: 4}
 * ) // 返回 {a: 1, b: 3, c: 4}
 */
export function mergeValues<T>(firstValue: T, ...values: (T | PatchType<T> | undefined)[]): T {
  const validValues = values.filter((x) => !isNil(x)) as T[]
  if (!validValues.length) return firstValue

  // 处理原始类型 - 使用第一个值判断类型
  if (typeof firstValue !== 'object') return validValues[validValues.length - 1]

  // 处理数组
  if (Array.isArray(firstValue)) return mergeList(firstValue, ...(validValues as AnyType[]))

  // 处理对象
  return mergeProps(firstValue as AnyObject, ...(validValues as AnyObject[])) as T
}

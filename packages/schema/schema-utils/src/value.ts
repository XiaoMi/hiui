/**
 * 检查值是否为无效值
 * - 检查值是否为 null/undefined/空串/空数组
 */
export function isInvalidValue(value?: unknown): value is null | undefined | '' | [] {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

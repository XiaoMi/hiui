import { merge } from 'lodash-es'
import type { FieldConfigType } from './type'

// 设置字段对象携带的辅助字段
// 这里逻辑很简单，之所以要搞一个函数出来，是为了方便后面查找到底有哪里在设置辅助字段
export function setPayload(field: FieldConfigType, payload: Partial<FieldConfigType['payload']>) {
  // merge 会修改原对象
  return merge(field, { payload })
}

// 文本/文本域/数字输入框 使用请输入，其他默认使用请选择
const inputTypeSet = new Set(['text', 'textarea', 'number'] as const)
/** 生成必填项的提示信息 */
export function genRequiredMsg(field: FieldConfigType) {
  const prefix = inputTypeSet.has(field.valueType as 'text') ? '请输入' : '请选择'
  return `${prefix}${field._titleText}`
}

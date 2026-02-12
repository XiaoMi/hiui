import type { ProField, ProFieldRenderEditableCtx } from '../../base'
import type { ProSelectableField } from './index'

export type RefillPlaceholderProps = {
  /** 字段的值 */
  value: unknown
  /** 选项数据 */
  data: AnyArray
  /** 默认渲染函数 */
  dftRender?: ProField['renderEditable']
  /** 字段名映射 */
  fieldNames?: Record<string, string>
  /** 渲染上下文 */
  ctx: ProFieldRenderEditableCtx<AnyObject>
  /** 字段的渲染实例 */
  instance: ProSelectableField
}

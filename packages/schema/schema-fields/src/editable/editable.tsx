import React, { useState } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { Schedular } from '@hi-ui/schema-utils'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type {
  EnhancedRenderersType,
  FieldRendererType,
  ProField,
  ProFieldRenderEditableCtx,
} from '../index'

export { isReadonly } from './use-readonly'

export type EditableCaseProps = {
  /** 字段配置 */
  field: FieldConfigType
  /** 字段渲染器 */
  FieldClass: typeof ProField
  /** 渲染的上下文 */
  ctx: Omit<ProFieldRenderEditableCtx, 'onActivate' | 'onDeactivate'>
  /** 当前值 */
  value?: unknown
  /** 失焦时是否保持激活状态，默认为false */
  keepActiveOnBlur?: boolean
  /** 是否默认激活 */
  defaultActive?: boolean
}

export function EditableCase(props: EditableCaseProps) {
  const { field, ctx, value } = props

  const fieldRenderer = new props.FieldClass()

  // 控制是否显示实际的表单组件
  const [isActive, _setIsActive] = useState(() => props.defaultActive || false)
  // 启用 defaultActive 时，isActive始终为 true
  const setIsActive = (value: boolean) => _setIsActive(props.defaultActive || value)
  const handleActivate = () => {
    setIsActive(true)
  }
  const handleBlur = (event?: React.FocusEvent<HTMLDivElement>) => {
    // 如果配置了失焦时保持激活状态，则直接跳过
    if (props.keepActiveOnBlur) return

    if (!event) return
    const { currentTarget, relatedTarget } = event

    // 检查是否在当前容器内
    if (relatedTarget && currentTarget.contains(relatedTarget as Node)) return

    // // 检查是否在HiUI的Portal中
    if (relatedTarget instanceof Element) {
      const portalElement = relatedTarget.closest(`[class^="${getPrefixCls('portal')}-"]`)
      if (portalElement) return
    }

    // 延迟一小会儿再设置为非激活状态
    // 避免在失焦时，订阅状态还没有更新，导致只读的文本闪烁
    Schedular.nextMacro(() => {
      setIsActive(false)
    }, 20) // 20*16 = 320ms // 是个经验值，不合适可以修改
  }

  // 可编辑但未激活时显示占位 Input
  if (!isActive) {
    const editableCtx = {
      field,
      rowData: ctx.rowData,
      rawData: ctx.rawData,
      formBinding: ctx.formBinding,
      formRef: ctx.formRef,
      onActivate: handleActivate,
      onDeactivate: handleBlur,
      rowIndex: ctx.rowIndex,
      dataKey: ctx.dataKey,
    } satisfies ProFieldRenderEditableCtx

    const renderEditable: Required<FieldRendererType>['renderEditable'] =
      field.renderer?.renderEditable ||
      // renderEditable
      fieldRenderer.renderEditable.bind(fieldRenderer)

    const dom = renderEditable(value, editableCtx)
    const enhancedRenderers = field.extra?.enhancedRenderers as EnhancedRenderersType | undefined
    if (enhancedRenderers?.renderEditable) {
      const finalDom = enhancedRenderers.renderEditable(dom, {
        data: value,
        render: fieldRenderer,
        renderCtx: editableCtx,
      })
      return <>{finalDom}</>
    }

    return <>{renderEditable(value, editableCtx)}</>
  }

  // TODO 这里打个补丁，待后续表格支持全局的焦点管理能力后移除
  // 单选和单选级联在值变化时，直接触发失焦
  const patchedOnBlur = (...args: AnyArray) => {
    if (field.valueType === 'select' || field.valueType === 'cascader') {
      handleBlur(...args)
    }

    ctx.formBinding.onBlur?.(...(args as [unknown]))
  }

  const nextCtx: typeof ctx = {
    ...ctx,
    formBinding: { ...ctx.formBinding, onBlur: patchedOnBlur },
  }
  // 激活编辑态时显示实际的表单组件
  const renderFormItem: Required<FieldRendererType>['renderFormItem'] =
    field.renderer?.renderFormItem ||
    // renderFormItem
    fieldRenderer.renderFormItem.bind(fieldRenderer)
  return (
    <div data-case="editing" onBlur={handleBlur}>
      {renderFormItem(null, nextCtx)}
    </div>
  )
}

// 实测不处理这个失焦问题，体验反而更好
// 把处理的逻辑留在这里，如有需要再考虑启用吧
// export function EditableCase(props: EditableCaseProps) {
//   // ~~一个已知问题是，表单项的组件需要彻底激活后失焦，才会触发 onBlur
//   // ~~如果仅仅是聚焦到占位元素，进入active 状态，但不使用表单项，就无法正确回到 unActive 状态
//   // ~~也就会一直处于 active 状态，渲染真实的表单项
//   // 下面一段代码用来解决这个问题 ↑↑↑↑↑
//   const editingWrapperRef = React.useRef<HTMLDivElement>(null)
//   React.useEffect(() => {
//     if (isActive && editingWrapperRef.current) {
//       editingWrapperRef.current.focus()
//     }
//   }, [isActive])

//   // 激活编辑态时显示实际的表单组件
//   return (
//     <div
//       // 下面两个属性允许 div 获取焦点
//       ref={editingWrapperRef}
//       tabIndex={-1} // 只能通过代码(focus()方法)聚焦，不能通过Tab键聚焦
//     ></div>
//   )
// }

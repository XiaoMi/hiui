import React from 'react'
import Select, { type SelectProps } from '@hi-ui/select'
import { AsyncOptsDataInjector } from '@hi-ui/schema-option-injector'
import { InterruptInjector } from '@hi-ui/schema-interrupt-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/schema-option-injector'
import { ProSelectableField, type RefillPlaceholderProps } from '../../../extensible/selectable'
import type {
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderFormItemCtx,
} from '../../../base'

export type ProSelectProps = WithAsyncOptsDataProps<
  SelectProps & {
    // ProSelectProps
  }
>

export class ProSelect extends ProSelectableField {
  render(data: unknown, ctx: ProFieldRenderCtx<ProSelectProps>): React.ReactElement {
    const title = this.getOptionTitle(ctx) || data
    return super.render(title, ctx)
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProSelectProps>) {
    const fieldProps = this.getFieldProps(
      {
        placeholder: this.getDftPlaceholder(ctx),
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )

    return (
      <AsyncOptsDataInjector
        {...fieldProps}
        renderCtx={ctx}
        setSelectedRawOption={ctx.field.payload?.setSelectedRawOption}
      >
        <InterruptInjector config={ctx.field.control?.interrupt}>
          <Select />
        </InterruptInjector>
      </AsyncOptsDataInjector>
    )
  }

  renderEditable(data: string, ctx: ProFieldRenderEditableCtx<ProSelectProps>) {
    // 首先尝试渲染已选中元素的标题
    const selectedEl = this.renderEditableForStringSelected(data, ctx)
    if (selectedEl) return selectedEl

    // 随后尝试渲染首次回显元素
    const firstRefillEl = this.renderEditableForStringFirstRefill(data, ctx, {
      dftRender: super.renderEditable.bind(this),
      RefillComponent: SelectRefillPlaceholder,
    })
    if (firstRefillEl) return firstRefillEl

    return super.renderEditable(data, ctx, { suffix: this.suffixEl })
  }
}

export function SelectRefillPlaceholder(props: RefillPlaceholderProps) {
  const { data: options = [], ctx, fieldNames, instance } = props
  const { id: idFieldKey = 'id', title: titleFieldKey = 'title' } = fieldNames || {}

  try {
    const matchedOpts = options.filter((item) => item[idFieldKey] === props.value)
    const displayTitle = matchedOpts[0]?.[titleFieldKey]

    // 最终是显示字符串，所以直接使用 dftRender 渲染
    return <>{props.dftRender?.(displayTitle, ctx, { suffix: instance.suffixEl })}</>
  } catch (error) {
    console.error('SelectRefillPlaceholder', error)
    return <>{props.dftRender?.(props.value, ctx, { suffix: instance.suffixEl })}</>
  }
}

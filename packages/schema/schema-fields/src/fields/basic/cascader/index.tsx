import React from 'react'
import Cascader, { type CascaderProps } from '@hi-ui/cascader'
import { AsyncOptsDataInjector } from '@hi-ui/schema-option-injector'
import { InterruptInjector } from '@hi-ui/schema-interrupt-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/schema-option-injector'
import { ProSelectableField, type RefillPlaceholderProps } from '../../../extensible/selectable'
import { matchCascaderOpts } from '../../../extensible/selectable/match-cascader'
import type { ProFieldRenderEditableCtx, ProFieldRenderFormItemCtx } from '../../../base'

export type ProCascaderProps = WithAsyncOptsDataProps<
  CascaderProps & {
    // ProCascaderProps
  }
>

export class ProCascader extends ProSelectableField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCascaderProps>) {
    const fieldProps = this.getFieldProps(
      {
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )

    // 过滤掉原始参数中的自引用属性，防止 immer 在处理数据时出现崩溃
    const hookedSetSelectedRawOption = this.hookedSetSelectedRawOption.bind(this, ctx) as AnyFn

    return (
      <AsyncOptsDataInjector
        // options
        {...fieldProps}
        renderCtx={ctx}
        setSelectedRawOption={hookedSetSelectedRawOption}
      >
        <InterruptInjector config={ctx.field.control?.interrupt}>
          <Cascader />
        </InterruptInjector>
      </AsyncOptsDataInjector>
    )
  }

  renderEditable(data: string, ctx: ProFieldRenderEditableCtx<ProCascaderProps>) {
    // 首先尝试渲染已选中元素的标题
    const selectedEl = this.renderEditableForStringSelected(data, ctx)
    if (selectedEl) return selectedEl

    // 随后尝试渲染首次回显元素
    const firstRefillEl = this.renderEditableForStringFirstRefill(data, ctx, {
      dftRender: super.renderEditable.bind(this),
      RefillComponent: CascaderRefillPlaceholder,
    })
    if (firstRefillEl) return firstRefillEl

    return super.renderEditable(data, ctx, { suffix: this.suffixEl })
  }
}

export function CascaderRefillPlaceholder(props: RefillPlaceholderProps) {
  const { data: options = [], ctx, fieldNames, instance } = props

  try {
    const _hereValue = (props.value as string[]) ?? []

    // 使用公用的 matchCascaderOpts 函数 // 注意这里取了0
    const matchedOptions = matchCascaderOpts([_hereValue], options, { fieldNames })[0] ?? []

    // 显示所有匹配到的标题
    const displayTitle = matchedOptions.map((item) => item.title).join('/')

    // 最终是显示字符串，所以直接使用 dftRender 渲染
    return <>{props.dftRender?.(displayTitle, ctx, { suffix: instance.suffixEl })}</>
  } catch (error) {
    console.error('CascaderRefillPlaceholder', error)
    return <>{props.dftRender?.(props.value, ctx, { suffix: instance.suffixEl })}</>
  }
}

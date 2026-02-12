import React from 'react'
import CheckSelect, { type CheckSelectProps } from '@hi-ui/check-select'
import { AsyncOptsDataInjector } from '@hi-ui/schema-option-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/schema-option-injector'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { ProSelectableField } from '../../../extensible/selectable'
import { ProTag, type ProTagProps } from '../../semantic/tag'
import type {
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderFormItemCtx,
} from '../../../base'
import type { NormalFieldCtxType } from '../../../utils'

export type ProCheckSelectProps = WithAsyncOptsDataProps<
  CheckSelectProps & {
    /**
     * 是否显示边框
     * - 只读模式渲染为标签
     */
    bordered?: ProTagProps['bordered']
    /**
     * 标签颜色预设
     * - 只读模式渲染为标签
     */
    colorPreset?: ProTagProps['colorPreset']
    /**
     * 标签属性
     * - 只读模式渲染为标签
     */
    tagProps?: ProTagProps
  }
>

export class ProCheckSelect extends ProSelectableField {
  private tagRef!: ProTag

  render(data: string[], ctx: ProFieldRenderCtx<ProCheckSelectProps>) {
    const title = this.getOptionTitle(ctx) || data
    const tagRef = this.tagRef || new ProTag()
    this.tagRef = tagRef

    const { tagProps } = this.getSelfFieldProps(ctx)

    return tagRef.render(title, {
      ...ctx,
      field: {
        fieldProps: tagProps,
      } as FieldConfigType<ProTagProps>,
    })
  }

  getSelfFieldProps(ctx: NormalFieldCtxType<ProCheckSelectProps>) {
    const { bordered, colorPreset, tagProps, ...fieldProps } = this.getFieldProps(
      {
        placeholder: this.getDftPlaceholder(ctx),
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )

    return {
      fieldProps: fieldProps as ProCheckSelectProps,
      tagProps: {
        bordered,
        colorPreset,
        ...tagProps,
      } as ProTagProps,
    }
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCheckSelectProps>) {
    const { fieldProps } = this.getSelfFieldProps(ctx)

    return (
      <AsyncOptsDataInjector
        {...fieldProps}
        renderCtx={ctx}
        setSelectedRawOption={ctx.field.payload?.setSelectedRawOption}
      >
        <CheckSelect />
      </AsyncOptsDataInjector>
    )
  }

  getDftPlaceholder(ctx: NormalFieldCtxType<ProCheckSelectProps>) {
    const titleText = ctx.field._titleText
    if (titleText) return `请选择${titleText}`
  }

  renderEditable(data: string[], ctx: ProFieldRenderEditableCtx<ProCheckSelectProps>) {
    const { dataKey } = ctx
    const title = this.getOptionTitle(ctx, dataKey)

    return super.renderEditable(title, ctx, {
      suffix: this.suffixEl,
    })
  }
}

import React from 'react'
import { isNil } from 'lodash-es'
import Input, { InputProps } from '@hi-ui/input'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { AbstractProField } from '@hi-ui/schema-core'
import type {
  FormItemProps,
  ProFieldProps,
  ProFieldRenderCtx,
  ProFieldRenderCellCtx,
  ProFieldRenderFooterCellCtx,
  ProFieldRenderFormItemCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderEditCellCtx,
  FieldRendererType,
} from '@hi-ui/schema-core'
import { Span } from './components/span'
import { getFieldProps, getFormItemProps, getWrapperProps } from './utils'
import type { NormalFieldCtxType } from './utils'

export {
  ProFieldProps,
  ProFieldRenderCtx,
  ProFieldRenderCellCtx,
  ProFieldRenderFooterCellCtx,
  ProFieldRenderFormItemCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderEditCellCtx,
  FieldRendererType,
}

/**
 * 增强型的自定义渲染函数
 * - 用于在字段内部渲染逻辑的基础之上进行额外增强
 */
export type EnhancedRenderersType = Partial<{
  [K in keyof AbstractProField as K extends 'constructor'
    ? never
    : K]: AbstractProField[K] extends AnyFn
    ? (
        dom: React.ReactNode,
        innerCtx: {
          render: ProField
          data: Parameters<AbstractProField[K]>[0]
          renderCtx: Parameters<AbstractProField[K]>[1]
        }
      ) => React.ReactNode
    : never
}>

export class ProField extends AbstractProField {
  dftDom = (<span data-case="default">-</span>)

  protected getFieldProps<FieldProps extends AnyObject>(
    dftProps: FieldProps,
    ctx: NormalFieldCtxType<FieldProps>
  ) {
    return getFieldProps(dftProps, ctx)
  }

  protected getWrapperProps<WrapperProps extends AnyObject>(
    dftProps: WrapperProps,
    ctx: Pick<ProFieldRenderCtx<AnyObject, WrapperProps>, 'field'>
  ) {
    return getWrapperProps(dftProps, ctx)
  }

  protected getFormItemProps(
    dftProps: FormItemProps,
    ctx: Pick<ProFieldRenderFormItemCtx, 'field'>
  ) {
    return getFormItemProps(dftProps, ctx)
  }

  /**
   * 渲染字符串的内部方法
   * @desc 很多类型的字段最终渲染时都是文本，因此提取一个公共方法到此处
   * @desc 封装了 EllipsisTooltip 的逻辑 */
  protected renderString(text: string, ctx: ProFieldRenderCtx<ProFieldProps>) {
    const fieldProps = this.getFieldProps({ numberOfLines: 1 }, ctx)

    return (
      <Span>
        <EllipsisTooltip
          className={fieldProps.tooltipClassName}
          numberOfLines={fieldProps.numberOfLines}
        >
          {text}
        </EllipsisTooltip>
      </Span>
    )
  }

  /** 只读模式的渲染逻辑 */
  render(data: unknown, ctx: ProFieldRenderCtx<AnyType>) {
    if (isNil(data)) return this.dftDom

    if (Array.isArray(data)) {
      if (data.length === 0) return this.dftDom
      return this.renderString(data.join(', '), ctx)
    }

    if (typeof data === 'object') {
      return this.renderString(JSON.stringify(data), ctx)
    }

    return this.renderString(String(data), ctx)
  }

  /**
   * 表格单元格渲染逻辑
   * @desc 默认直接使用 render 的逻辑 */
  renderCell(data: unknown, ctx: ProFieldRenderCellCtx<AnyType>) {
    return this.render(data, ctx)
  }

  /**
   * 表格 Footer 单元格渲染逻辑
   * @desc 没有默认逻辑，需由字段自行实现 */
  renderFooterCell(ctx: ProFieldRenderFooterCellCtx<AnyType>) {
    console.log(ctx) // 仅用于规避定义未使用检查
    return null as React.ReactNode
  }

  renderFormItem(data: null, ctx: ProFieldRenderFormItemCtx<AnyType>) {
    console.log(data, ctx) // 仅用于规避定义未使用检查
    throw new Error('ProField.renderFormItem not implemented')
  }

  protected getEditablePlaceholder(
    data: unknown,
    ctx: ProFieldRenderEditableCtx<AnyType>
  ): unknown {
    if (isNil(data)) return ''

    if (typeof data === 'string') return data
    if (typeof data === 'number') return String(data)
    if (typeof data === 'boolean') return data ? 'true' : 'false'
    if (Array.isArray(data)) return data.join(' / ')
    if (typeof data === 'object') return JSON.stringify(data)

    return ''
  }

  /** 编辑模式的渲染逻辑，在只读与可编辑之间切换 */
  renderEditable(data: unknown, ctx: ProFieldRenderEditableCtx<AnyType>, extraProps?: InputProps) {
    const fieldProps = this.getFieldProps(
      {
        placeholder: this.getDftPlaceholder(ctx),
      },
      ctx
    )

    return (
      <Input
        value={this.getEditablePlaceholder(data, ctx) as string}
        readOnly
        disabled={ctx.field.control?.disabled}
        onDoubleClick={ctx.onActivate}
        onFocus={ctx.onActivate}
        placeholder={fieldProps.placeholder}
        {...extraProps}
      />
    )
  }

  getDftPlaceholder(ctx: NormalFieldCtxType<AnyType>) {
    const titleText = ctx.field._titleText
    if (titleText) return `请输入${titleText}`
  }
}

export type FieldMapType = Record<string, typeof ProField>

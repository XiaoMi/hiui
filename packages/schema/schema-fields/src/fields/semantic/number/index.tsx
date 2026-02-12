import React from 'react'
import { isNil } from 'lodash-es'
import NumberInput, { type NumberInputProps } from '@hi-ui/number-input'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { NumberUtil } from '@hi-ui/schema-utils'
import { ProField } from '../../../base'
import { Span } from '../../../components/span'
import type {
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderFormItemCtx,
} from '../../../base'
import type { NormalFieldCtxType } from '../../../utils'

export type ProNumberProps = NumberInputProps & {
  /**
   * 指定数字变化的精度
   * @desc 可编辑模式时，指定数字变化的精度
   * @desc 内部使用 HiUI 的 formatter 方法实现四舍五入精度处理
   * @desc 如需更复杂的格式化逻辑精度处理，请结合 NumberUtil 自行实现 formatter 方法
   */
  precision?: number
}

export class ProNumber extends ProField {
  protected _getFieldProps(ctx: NormalFieldCtxType<ProNumberProps>) {
    const fieldProps = super.getFieldProps(
      {
        placeholder: this.getDftPlaceholder(ctx),
      },
      ctx
    )

    // 增加精度处理逻辑
    // 如果精度存在，且没有 formatter 方法，则增加精度处理逻辑
    if (!isNil(fieldProps.precision) && isNil(fieldProps.formatter)) {
      fieldProps.formatter = function ProNumberPrecisionFormatter(value: string | number) {
        return NumberUtil.round(value, fieldProps.precision)
      }
    }

    return fieldProps
  }

  render(data: unknown, ctx: ProFieldRenderCtx<ProNumberProps>) {
    // 不是数字
    if (typeof data !== 'number') {
      /** 且不存在 */ if (!data) return this.dftDom
    }
    // 或者是NaN
    else if (isNaN(data)) return this.dftDom

    const num = Number(data)
    if (isNaN(num)) return this.dftDom

    const formatted = this.toFormatted(num, ctx)

    return (
      <Span>
        <EllipsisTooltip>{formatted}</EllipsisTooltip>
      </Span>
    )
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProNumberProps>) {
    const fieldProps = this._getFieldProps(ctx)
    return <NumberInput {...fieldProps} />
  }

  protected getEditablePlaceholder(data: unknown) {
    // 记录：返回undefined，会被转换为0，null则不会
    if (isNil(data)) return null
    if (typeof data === 'number') return isNaN(data) ? null : data

    const num = Number(data)
    return isNaN(num) ? null : num
  }

  renderEditable(data: unknown, ctx: ProFieldRenderEditableCtx<ProNumberProps>) {
    const fieldProps = this._getFieldProps(ctx)

    return (
      <NumberInput
        value={this.getEditablePlaceholder(data)}
        disabled={ctx.field.control?.disabled}
        onDoubleClick={ctx.onActivate}
        onFocus={ctx.onActivate}
        placeholder={fieldProps.placeholder}
        formatter={fieldProps.formatter}
        min={fieldProps.min}
        max={fieldProps.max}
        step={fieldProps.step}
        onChange={ctx.onActivate} // 占位元素change时，进入激活状态
      />
    )
  }

  // 可能之后还有更复杂的格式化逻辑
  toFormatted(data: number, ctx: NormalFieldCtxType<ProNumberProps>) {
    const fieldProps = this._getFieldProps(ctx)

    // 123456789 => 123,456,789
    // 123.456789 => 123.4567 // precision: 4
    return data.toLocaleString('zh-Hans', {
      // 也是四舍五入进位
      minimumFractionDigits: fieldProps.precision,
      maximumFractionDigits: fieldProps.precision,
    })
  }
}

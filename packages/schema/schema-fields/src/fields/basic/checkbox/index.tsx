import React from 'react'
import Checkbox, { type CheckboxGroupProps } from '@hi-ui/checkbox'
import { getPrefixCls } from '@hi-ui/classname'
import { GridHelper, type BasicGridOptsType } from '@hi-ui/schema-auto-grid'
import { getBoolConfig, type BoolConfig } from '@hi-ui/schema-utils'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProCheckboxProps = CheckboxGroupProps & {
  /** 网格配置 */
  grid?: BoolConfig<BasicGridOptsType>
}

export class ProCheckbox extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCheckboxProps>) {
    const { grid: gridProps, ...fieldProps } = this.getFieldProps({}, ctx)

    // gridProps 为 true 或者对象时，使用网格布局
    if (gridProps) {
      return this.renderGridFormItem(_, ctx, { gridProps, fieldProps })
    }

    return this.renderNormalFormItem(_, ctx, { fieldProps })
  }

  renderNormalFormItem(
    _: null,
    ctx: ProFieldRenderFormItemCtx<ProCheckboxProps>,
    extra: {
      fieldProps: Omit<ProCheckboxProps, 'grid'>
    }
  ) {
    const { fieldProps } = extra
    return <Checkbox.Group {...fieldProps} />
  }

  renderGridFormItem(
    _: null,
    ctx: ProFieldRenderFormItemCtx<ProCheckboxProps>,
    extra: {
      fieldProps: Omit<ProCheckboxProps, 'grid'>
      gridProps: ProCheckboxProps['grid']
    }
  ) {
    const { data = [], ...restFieldProps } = extra.fieldProps
    const value = (ctx.formBinding.value ?? []) as AnyArray

    const gridProps = getBoolConfig(extra.gridProps, {}) ?? {}
    return (
      <Checkbox.Group {...restFieldProps}>
        <GridHelper {...gridProps}>
          {
            // fork from hiui Checkbox.Group
            // https://github.com/XiaoMi/hiui/blob/0180764ef5deb334f70404cabd3d715708d41b06/packages/ui/checkbox/src/CheckboxGroup.tsx#L65-L76
            data.map(({ id, disabled, title }) => (
              <Checkbox
                key={id}
                value={id}
                name={restFieldProps.name}
                disabled={disabled}
                checked={value.includes(id)}
                className={`${getPrefixCls('checkbox-group')}__item`}
              >
                {title}
              </Checkbox>
            ))
          }
        </GridHelper>
      </Checkbox.Group>
    )
  }
}

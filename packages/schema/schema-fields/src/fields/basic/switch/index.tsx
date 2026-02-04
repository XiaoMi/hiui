import React from 'react'
import Switch, { type SwitchProps } from '@hi-ui/switch'
import { InterruptInjector } from '@hi-ui/interrupt-injector'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProSwitchProps = SwitchProps & {
  // ProSwitchProps
}

export class ProSwitch extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProSwitchProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return (
      <InterruptInjector config={ctx.field.control?.interrupt}>
        <Switch
          {...fieldProps}
          // Switch 组件的 checked 属性，需要手动绑定
          checked={ctx.formBinding.value as boolean}
        />
      </InterruptInjector>
    )
  }
}

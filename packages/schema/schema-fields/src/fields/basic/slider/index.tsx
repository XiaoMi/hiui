import React from 'react'
import Slider, { type SliderProps } from '@hi-ui/slider'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProSliderProps = SliderProps & {
  // ProSliderProps
}

export class ProSlider extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProSliderProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return <Slider {...fieldProps} />
  }
}

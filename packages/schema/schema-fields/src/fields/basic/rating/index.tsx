import React from 'react'
import Rating, { type RatingProps } from '@hi-ui/rating'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProRatingProps = RatingProps & {
  // ProRatingProps
}

export class ProRating extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProRatingProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return <Rating {...fieldProps} />
  }
}

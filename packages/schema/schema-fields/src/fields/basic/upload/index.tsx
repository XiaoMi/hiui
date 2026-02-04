import React from 'react'
import { cx } from '@hi-ui/classname'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'
import { CommonUpload, type CommonUploadProps } from './custom'

export { CommonUpload, CommonUploadProps }

export type ProUploadProps = CommonUploadProps & {
  // ProUploadProps
}

export class ProUpload extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProUploadProps>) {
    const fieldProps = this.getFieldProps({ value: undefined }, ctx)
    const className = cx('pro-upload', fieldProps.className)

    return (
      <CommonUpload
        // pro-upload
        {...fieldProps}
        className={className}
      />
    )
  }
}

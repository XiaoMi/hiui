import React from 'react'
import { cx } from '@hi-ui/classname'
import { ImagePreview } from '../../../components/image-preview'
import { ProField } from '../../../base'
import { Span } from '../../../components/span'
import type { ProFieldRenderCtx, ProFieldRenderFormItemCtx } from '../../../base'
import { ImageUpload, type ImageUploadProps } from './upload'

export type ProImageProps = UnknownObject & {
  customImages?: (data: string[], ctx: ProFieldRenderCtx<ProImageProps>) => string[]
}
export { ImageUpload, ImageUploadProps }

export class ProImage extends ProField {
  render(data: unknown, ctx: ProFieldRenderCtx<ProImageProps>) {
    if (!data) return this.dftDom
    if (Array.isArray(data) && data.length === 0) return this.dftDom

    const dftImages = (Array.isArray(data) ? data : [data]) as string[]

    const fieldProps = this.getFieldProps({}, ctx)
    const images = fieldProps.customImages?.(dftImages, ctx) || dftImages

    return (
      <Span dataSet={{ fieldType: ctx.field.valueType as string }}>
        <ImagePreview images={images} />
      </Span>
    )
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ImageUploadProps>) {
    const fieldProps = this.getFieldProps({ value: undefined }, ctx)
    const className = cx('pro-image-upload', fieldProps.className)

    return (
      <ImageUpload
        // pro-upload
        {...fieldProps}
        className={className}
      />
    )
  }
}

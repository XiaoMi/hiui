import React from 'react'
import { PictureUpload } from '@hi-ui/upload'
import { mergeProps } from '@hi-ui/schema-utils'
import { UploadBridge, type UploadBridgeProps } from '../../../components/upload-bridge'

export type ImageUploadProps = Omit<UploadBridgeProps, 'type'>

export function ImageUpload(props: ImageUploadProps) {
  const finalProps = mergeProps(
    {
      accept: '.png,.jpg,.jpeg,.gif,.webp,.svg',
    },
    props
  )

  return (
    <UploadBridge {...finalProps}>
      <PictureUpload />
    </UploadBridge>
  )
}

import React from 'react'
import Upload from '@hi-ui/upload'
import { UploadBridge, type UploadBridgeProps } from '../../../components/upload-bridge'

export type CommonUploadProps = UploadBridgeProps

export function CommonUpload(props: CommonUploadProps) {
  return (
    <UploadBridge {...props}>
      <Upload />
    </UploadBridge>
  )
}

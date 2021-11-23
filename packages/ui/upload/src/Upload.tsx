import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './interface'
import { NormalUpload } from './NormalUpload'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const Upload = forwardRef<HTMLDivElement | null, UploadProps>(
  ({ prefixCls = UPLOAD_PREFIX, role = 'upload', className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return <NormalUpload ref={ref} className={cls} {...rest} />
  }
)

if (__DEV__) {
  Upload.displayName = 'Upload'
}

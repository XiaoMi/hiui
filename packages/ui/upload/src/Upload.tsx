import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './interface'
import { NormalUpload } from './NormalUpload'
import { DragUpload } from './DragUpload'
import { PictureListUpload } from './PictureListUpload'
import { PictureUpload } from './PictureUpload'
import { AvatarUpload } from './AvatarUpload'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const Upload = forwardRef<HTMLDivElement | null, UploadProps>(
  ({ prefixCls = UPLOAD_PREFIX, role = 'upload', type, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    if (type === 'drag') {
      return <DragUpload ref={ref} className={cls} {...rest} />
    }

    if (type === 'pictureCard') {
      return <PictureListUpload ref={ref} className={cls} {...rest} />
    }

    if (type === 'photo') {
      return <PictureUpload ref={ref} className={cls} {...rest} />
    }

    if (type === 'avatar') {
      return <AvatarUpload ref={ref} className={cls} {...rest} />
    }

    return <NormalUpload ref={ref} className={cls} {...rest} />
  }
)

if (__DEV__) {
  Upload.displayName = 'Upload'
}

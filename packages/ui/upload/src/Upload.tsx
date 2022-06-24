import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './types'
import { NormalUpload } from './NormalUpload'
import { DragUpload } from './DragUpload'
import { PictureListUpload } from './PictureListUpload'
import { PictureUpload } from './PictureUpload'
import { AvatarUpload } from './AvatarUpload'

const UPLOAD_PREFIX = getPrefixCls('upload')
const NOOP_ARRAY = [] as []

/**
 * TODO: What is Upload
 */
export const Upload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      type = 'default',
      data = NOOP_ARRAY,
      className,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    switch (type) {
      case 'drag':
        return <DragUpload ref={ref} className={cls} data={data} {...rest} />
      case 'pictureCard':
        return <PictureListUpload ref={ref} className={cls} data={data} {...rest} />
      case 'photo':
        return <PictureUpload ref={ref} className={cls} data={data} {...rest} />
      case 'avatar':
        return <AvatarUpload ref={ref} className={cls} data={data} {...rest} />
      default:
        return <NormalUpload ref={ref} className={cls} data={data} {...rest} />
    }
  }
)

if (__DEV__) {
  Upload.displayName = 'Upload'
}

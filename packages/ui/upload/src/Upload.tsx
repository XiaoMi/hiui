import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  UploadProps,
  UploadSemanticClassNames,
  UploadSemanticStyles,
  UploadSemanticClassNamesResolved,
  UploadSemanticStylesResolved,
} from './types'
import { NormalUpload } from './NormalUpload'
import { DragUpload } from './DragUpload'
import { PictureListUpload } from './PictureListUpload'
import { PictureUpload } from './PictureUpload'
import { AvatarUpload } from './AvatarUpload'

const UPLOAD_PREFIX = getPrefixCls('upload')
const NOOP_ARRAY = [] as []

/**
 * 上传
 */
export const Upload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      type = 'default',
      data = NOOP_ARRAY,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const globalContext = useGlobalContext() as ReturnType<typeof useGlobalContext> & {
      upload?: { classNames?: any; styles?: any }
    }
    const { upload: uploadConfig } = globalContext
    const { classNames, styles } = useMergeSemantic<
      UploadSemanticClassNames,
      UploadSemanticStyles,
      UploadProps
    >({
      classNamesList: [uploadConfig?.classNames, classNamesProp],
      stylesList: [uploadConfig?.styles, stylesProp],
      info: { props: { ...rest, type } },
    })

    const cls = cx(prefixCls, className, classNames?.root)
    const rootStyle = { ...style, ...styles?.root }
    const resolvedClassNames = classNames as UploadSemanticClassNamesResolved | undefined
    const resolvedStyles = styles as UploadSemanticStylesResolved | undefined

    switch (type) {
      case 'drag':
        return (
          <DragUpload
            ref={ref}
            className={cx(cls, resolvedClassNames?.dragUpload)}
            style={{ ...rootStyle, ...resolvedStyles?.dragUpload }}
            data={data}
            {...rest}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
          />
        )
      case 'pictureCard':
        return (
          <PictureListUpload
            ref={ref}
            className={cx(cls, resolvedClassNames?.pictureListUpload)}
            style={{ ...rootStyle, ...resolvedStyles?.pictureListUpload }}
            data={data}
            {...rest}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
          />
        )
      case 'photo':
        return (
          <PictureUpload
            ref={ref}
            className={cx(cls, resolvedClassNames?.pictureUpload)}
            style={{ ...rootStyle, ...resolvedStyles?.pictureUpload }}
            data={data}
            {...rest}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
          />
        )
      case 'avatar':
        return (
          <AvatarUpload
            ref={ref}
            className={cx(cls, resolvedClassNames?.avatarUpload)}
            style={{ ...rootStyle, ...resolvedStyles?.avatarUpload }}
            data={data}
            {...rest}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
          />
        )
      default:
        return (
          <NormalUpload
            ref={ref}
            className={cx(cls, resolvedClassNames?.normalUpload)}
            style={{ ...rootStyle, ...resolvedStyles?.normalUpload }}
            data={data}
            {...rest}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
          />
        )
    }
  }
)

if (__DEV__) {
  Upload.displayName = 'Upload'
}

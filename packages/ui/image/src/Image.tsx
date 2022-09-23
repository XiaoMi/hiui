import React, { forwardRef, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import Preview, { PreviewProps } from '@hi-ui/preview'
import { isObject } from '@hi-ui/type-assertion'
import { useImage, UseImageProps } from './use-image'

const IMAGE_PREFIX = getPrefixCls('image')

/**
 * TODO: What is Image
 */
export const Image = forwardRef<HTMLDivElement | null, ImageProps>(
  (
    {
      prefixCls = IMAGE_PREFIX,
      role = 'image',
      className,
      style,
      src,
      width,
      height,
      fallback,
      placeholder,
      preview,
      onLoad,
      onError,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { status, imageProps, getImageRef } = useImage({
      fallback,
      placeholder,
      onError,
      src,
    })

    const [previewVisible, setPreViewVisible] = useState<boolean>(false)

    const canPreviewMemo = useMemo(() => {
      return preview && src && status !== 'error'
    }, [preview, src, status])

    const cls = cx(prefixCls, className, canPreviewMemo && `${prefixCls}--preview`)

    const handleClick = useLatestCallback((e) => {
      onClick?.(e)
      setPreViewVisible(true)
    })

    const handleClosePreview = useLatestCallback(() => {
      setPreViewVisible(false)
    })

    return (
      <>
        <div
          ref={ref}
          role={role}
          className={cls}
          style={{ ...style, width, height }}
          onClick={handleClick}
        >
          <img
            // @ts-ignore
            ref={getImageRef}
            className={`${prefixCls}-img`}
            {...{ width, height }}
            {...imageProps}
            {...rest}
          />
          {status === 'loading' && (
            <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
              {placeholder}
            </div>
          )}
        </div>
        {canPreviewMemo && (
          <Preview
            {...(isObject(preview) ? preview : {})}
            // @ts-ignore
            src={src}
            visible={previewVisible}
            onClose={handleClosePreview}
          />
        )}
      </>
    )
  }
)

export interface ImageProps extends Omit<HiBaseHTMLProps<'img'>, 'placeholder'>, UseImageProps {
  /**
   * 图片预览参数
   */
  preview?: Partial<PreviewProps> | boolean
}

if (__DEV__) {
  Image.displayName = 'Image'
}

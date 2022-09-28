import React, { useState, useEffect, useMemo } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { ImageStatus } from './types'

export const useImage = ({ placeholder, fallback, onLoad, onError, src }: UseImageProps) => {
  const isCustomPlaceholder = placeholder && placeholder !== true
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal')
  const isError = status === 'error'
  const isLoaded = useLatestRef(false)

  const handleLoad = useLatestCallback((e) => {
    onLoad?.(e)
    setStatus('normal')
  })

  const handleError = useLatestCallback((e) => {
    onError?.(e)
    setStatus('error')
  })

  const imageProps = useMemo(() => {
    return {
      ...(isError && fallback
        ? { src: fallback }
        : { src, onLoad: handleLoad, onError: handleError }),
    }
  }, [fallback, handleError, handleLoad, src, isError])

  const getImageRef = (img?: HTMLImageElement) => {
    isLoaded.current = false

    if (status !== 'loading') return

    if (img?.complete && (img.naturalWidth || img.naturalHeight)) {
      isLoaded.current = true
      setStatus('normal')
    }
  }

  useEffect(() => {
    if (isError) {
      setStatus('normal')
    }

    if (isCustomPlaceholder && !isLoaded.current) {
      setStatus('loading')
    }
  }, [src])

  return {
    status,
    imageProps,
    getImageRef,
  }
}

export interface UseImageProps {
  /**
   * 图片地址
   */
  src?: string
  /**
   * 加载失败容错地址
   */
  fallback?: string
  /**
   * 加载占位
   */
  placeholder?: React.ReactNode
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

export type useImageReturn = ReturnType<typeof useImage>

import React, { useState, useEffect, useRef } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useInput, UseInputProps } from '@hi-ui/input'
import { calcNodeAutoSizeStyles } from './utils'
import { mergeRefs } from '@hi-ui/use-merge-refs'

export const useTextarea = ({
  name,
  autoFocus,
  disabled,
  readOnly,
  maxLength,
  placeholder,
  defaultValue,
  value: valueProp,
  onChange,
  onFocus,
  onBlur,
  trimValueOnBlur,
  maxRows,
  minRows,
  autoSize,
}: UseTextareaProps) => {
  const { focused, value, tryChangeValue, getInputProps } = useInput({
    name,
    autoFocus,
    disabled,
    readOnly,
    maxLength,
    placeholder,
    defaultValue,
    value: valueProp,
    onChange: (_, evt) => {
      onChange?.(evt)
    },
    onFocus,
    onBlur,
    trimValueOnBlur,
  })

  const [textareaElement, setTextareaElement] = useState<HTMLTextAreaElement | null>(null)
  const [autoSizeStyles, setAutoSizeStyles] = useState<React.CSSProperties | undefined>(undefined)

  const rafIdRef = useRef<number | null>(null)
  // 当为 true 时，表示正在 resizing 过程中，此时拒绝监听 onResize 导致频繁计算渲染
  const resizingRef = useRef(false)

  const enabledAutoSize =
    autoSize === undefined ? typeof minRows === 'number' || typeof maxRows === 'number' : autoSize

  useEffect(() => {
    if (enabledAutoSize && textareaElement) {
      const styles = calcNodeAutoSizeStyles(textareaElement, minRows, maxRows)
      resizingRef.current = true
      setAutoSizeStyles(styles)
    }
    return () => {
      // 取消 onResize 的回调计算，避免多次更新
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [enabledAutoSize, value, textareaElement, minRows, maxRows])

  const handleResize = useLatestCallback(() => {
    // 正在 resizing 中不允许更新
    if (resizingRef.current) return

    if (enabledAutoSize && textareaElement) {
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = window.requestAnimationFrame(() => {
        const styles = calcNodeAutoSizeStyles(textareaElement, minRows, maxRows)
        resizingRef.current = true
        setAutoSizeStyles(styles)
      })
    }
  })

  useEffect(() => {
    // 渲染到dom之后，再结束 resizing 过程
    const rafId = window.requestAnimationFrame(() => {
      resizingRef.current = false
    })
    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [autoSizeStyles])

  const getTextareaProps = useLatestCallback((props = {}, ref = null) => {
    return {
      ref: mergeRefs(setTextareaElement, ref),
      autoComplete: 'off',
      ...props,
      ...getInputProps(),
      style: { ...props.style, ...autoSizeStyles },
    }
  })

  return {
    focused,
    autoSize: enabledAutoSize,
    value,
    tryChangeValue,
    getTextareaProps,
    onResize: handleResize,
  }
}

export interface UseTextareaProps
  extends Omit<
    UseInputProps,
    'onChange' | 'type' | 'clearElementRef' | 'onFocus' | 'onBlur' | 'onKeyDown'
  > {
  /**
   * 自适应内容高度
   */
  autoSize?: boolean
  /**
   * 自适应内容最大行数
   */
  maxRows?: number
  /**
   * 自适应内容最小行数
   */
  minRows?: number
  /**
   * 值改变时回调
   */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  /**
   * 文本框聚焦时回调
   */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  /**
   * 文本框失焦时回调
   */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
}

export type useTextareaReturn = ReturnType<typeof useTextarea>

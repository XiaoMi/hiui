import React, { forwardRef, useCallback, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'file-select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FileSelect
 */
export const FileSelect = forwardRef<HTMLDivElement | null, FileSelectProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      multiple,
      disabled,
      accept,
      onSelect,
      style,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const onClick = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    }, [])
    const cls = cx(prefixCls, className)
    return (
      <div onClick={onClick} className={cls} style={style} ref={ref} role={role}>
        <input
          type="file"
          multiple={multiple}
          disabled={disabled}
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            onSelect?.(e.target.files)
            if (inputRef.current) {
              inputRef.current.value = ''
            }
          }}
          ref={inputRef}
        />
        {children}
      </div>
    )
  }
)

export interface FileSelectProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 接受的上传文件类型
   */
  accept?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否支持批量上传
   */
  multiple?: boolean
  /**
   * 选择上传的事件
   */
  onSelect?: (files: HTMLInputElement['files']) => void
  children?: React.ReactNode
}

if (__DEV__) {
  FileSelect.displayName = 'FileSelect'
}

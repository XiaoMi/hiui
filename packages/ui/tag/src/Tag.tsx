import React, { forwardRef, useMemo, MouseEvent, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'tag'
const _prefix = getPrefixCls(_role)

/**
 * 标签 用来标记信息的属性，用以区分信息
 */
export const Tag = forwardRef<HTMLDivElement | null, TagProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      color,
      type = 'primary',
      appearance = 'default',
      shape = 'round',
      onClick,
      closeable = false,
      editable = false,
      onEdit,
    },
    ref
  ) => {
    // 根容器样式
    // 如果 color 存在则注入
    const rootStyle = useMemo(() => {
      const result = { ...style }

      if (color) {
        result.borderColor = color
        if (appearance === 'default') {
          result.background = color
        } else {
          result.color = color
        }
      }

      return result
    }, [color, style, appearance])

    const [isInEdit, setIsInEdit] = useState(false)
    const [editValueCache, setEditValueCache] = useState('')

    const rootClassName = useMemo(
      () =>
        cx(
          prefixCls,
          className,
          `${prefixCls}--type-${type}`,
          `${prefixCls}--appearance-${appearance}`,
          `${prefixCls}--shape-${shape}`,
          {
            [`${prefixCls}--editable`]: editable,
            [`${prefixCls}--in-edit`]: editable && isInEdit,
          }
        ),
      [prefixCls, className, type, appearance, shape, editable, isInEdit]
    )

    return (
      <div ref={ref} role={role} className={rootClassName} style={rootStyle} onClick={onClick}>
        <div className={`${prefixCls}__content-wrapper`}>
          <div className={`${prefixCls}__content`}>{isInEdit ? editValueCache : children}</div>
          {editable && isInEdit && (
            <input
              className={`${prefixCls}__input`}
              autoFocus
              value={editValueCache}
              onChange={(e) => setEditValueCache(e.target.value)}
              onBlur={(e) => {
                setIsInEdit(false)
                onEdit && onEdit(e.target.value)
              }}
            />
          )}
        </div>
        {editable && !isInEdit && (
          <div
            className={`${prefixCls}__double-click-trigger`}
            onDoubleClick={() => {
              setEditValueCache(children as string)
              setIsInEdit(true)
            }}
          />
        )}
      </div>
    )
  }
)

export interface TagProps {
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
   * 类型状态
   */
  type?: 'primary' | 'success' | 'warning' | 'danger'
  /**
   * 外观
   */
  appearance?: 'default' | 'line'
  /**
   * 形状
   */
  shape?: 'round' | 'square'
  /**
   * 标签背景色
   */
  color?: string
  /**
   * 点击标签内容时的回调
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void

  children?: string
  /**
   * 是否展示可关闭按钮
   */
  closeable?: boolean
  /**
   * 是否可编辑
   */
  editable?: boolean

  /**
   * tag 修改操作
   * @param content tag 修改后内容
   */
  onEdit?: (content: string) => void
  /**
   * tag 删除操作
   */
  onDelete?: () => void
}

if (__DEV__) {
  Tag.displayName = 'Tag'
}

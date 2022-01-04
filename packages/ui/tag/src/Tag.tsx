import React, { forwardRef, useMemo, MouseEvent, useState, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { CloseOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { Tooltip } from '@hi-ui/tooltip'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'tag'
const _prefix = getPrefixCls(_role)

const DEFAULT_TRANSFORMER = (e: React.ReactNode) => e?.toString() || ''

/**
 * 标签
 *
 * 用来标记信息的属性，用以区分信息
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
      background,
      type = 'default',
      appearance = 'default',
      size = 'small',
      onClick,
      closeable = false,
      editable = false,
      onDelete,
      onEdit,
      autoEditable = false,
      maxWidth,
      childrenToStringTransformer = DEFAULT_TRANSFORMER,
    },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement | null>(null)

    const [isInEdit, setIsInEdit] = useState(false)
    const [editValueCache, setEditValueCache] = useState('')
    const [isShowPopover, setIsShowPopover] = useState(false)

    // 根容器样式
    // 如果 color 存在则注入
    const rootStyle = useMemo(() => {
      const result = { ...style } as React.CSSProperties

      if (color) {
        result.color = color
      }

      if (background) {
        result.background = background
      }
      // 编辑时刻，不限制最大宽度
      if (maxWidth && !isInEdit) {
        result.maxWidth = `${maxWidth}px`
      }

      return result
    }, [style, color, background, isInEdit, maxWidth])

    useEffect(
      () => {
        if (autoEditable) {
          setEditValueCache(childrenToStringTransformer(children))
          setIsInEdit(true)
        }
      },
      // 此处请不要添加任何作为依赖，autoEditable 只会在组件创建时起作用
      // @ts-ignore
      []
    )
    const rootClassName = useMemo(
      () =>
        cx(
          prefixCls,
          className,
          `${prefixCls}--type-${type}`,
          `${prefixCls}--appearance-${appearance}`,
          `${prefixCls}--size-${size}`,
          {
            [`${prefixCls}--editable`]: editable,
            [`${prefixCls}--in-edit`]: editable && isInEdit,
            [`${prefixCls}--hover-enable`]: editable || closeable,
          }
        ),
      [prefixCls, className, type, appearance, size, editable, isInEdit, closeable]
    )

    useEffect(() => {
      // 从 编辑态 到 非编辑态
      if (!isInEdit) {
        // 下一帧，等待渲染完成，再进行测量操作，判断是否需要 tooltip 展示全部字符
        setTimeout(() => {
          if (contentRef.current) {
            setIsShowPopover(contentRef.current.scrollWidth > contentRef.current.offsetWidth)
          } else {
            setIsShowPopover(false)
          }
        }, 0)
      }
    }, [isInEdit])

    const { component: WrapperComponent, componentProps } = useMemo(
      () =>
        isShowPopover && !isInEdit
          ? {
              component: Tooltip,
              componentProps: {
                title: childrenToStringTransformer(children),
                trigger: 'hover',
              },
            }
          : {
              component: React.Fragment,
              componentProps: {},
            },
      [isShowPopover, children, isInEdit, childrenToStringTransformer]
    )

    return (
      <WrapperComponent {...(componentProps as any)}>
        <div ref={ref} role={role} className={rootClassName} style={rootStyle} onClick={onClick}>
          <div className={`${prefixCls}__content-wrapper`}>
            <div className={`${prefixCls}__content`} ref={contentRef}>
              {isInEdit ? editValueCache : children}
            </div>
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
            {editable && !isInEdit && (
              <div
                className={`${prefixCls}__double-click-trigger`}
                onDoubleClick={(e) => {
                  setEditValueCache(childrenToStringTransformer(children))
                  setIsInEdit(true)
                }}
              />
            )}
          </div>
          {!isInEdit && closeable && (
            <div className={`${prefixCls}__close-button`} onClick={onDelete}>
              <CloseOutlined />
            </div>
          )}
        </div>
      </WrapperComponent>
    )
  }
)

export interface TagProps extends HiBaseHTMLProps<'div'> {
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
   * @default 'default'
   */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /**
   * 外观
   * @default 'default'
   */
  appearance?: 'default' | 'solid'
  /**
   * 标签尺寸
   * @default 'small'
   */
  size?: 'mini' | 'small' | 'medium'
  /**
   * 标签文字颜色
   */
  color?: string
  /**
   * 标签背景色
   */
  background?: string
  /**
   * 子代转换为 string 类型转换器
   * @param children 子代对象
   * @default e => e?.toString() || ''
   */
  childrenToStringTransformer?: (children: React.ReactNode) => string
  /**
   * 点击标签内容时的回调
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  /**
   * 是否展示可关闭按钮
   * @default false
   */
  closeable?: boolean
  /**
   * 是否可编辑（当使用此功能时，如果 children.toString 无法自动转换成预期的字符串，则请自行配置转换器 childrenToStringTransformer 属性）
   * @default false
   */
  editable?: boolean
  /**
   * 是否一开始自动可编辑
   * @default false
   */
  autoEditable?: boolean
  /**
   * tag 修改操作
   * @param content tag 修改后内容
   */
  onEdit?: (content: string) => void
  /**
   * tag 删除操作
   */
  onDelete?: () => void
  /**
   * 最大宽度，如超出，则截断末尾添加省略号，鼠标悬浮气泡展示（当使用此功能时，如果 children.toString 无法自动转换成预期的字符串，则请自行配置转换器 childrenToStringTransformer 属性）
   * @default 0 代表不限制宽度
   */
  maxWidth?: number

  children?: React.ReactNode
}

if (__DEV__) {
  Tag.displayName = 'Tag'
}

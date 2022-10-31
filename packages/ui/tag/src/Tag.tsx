import React, { forwardRef, useMemo, useState, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { CloseOutlined } from '@hi-ui/icons'
import { __DEV__, invariant } from '@hi-ui/env'
import { Tooltip } from '@hi-ui/tooltip'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'tag'
const _prefix = getPrefixCls(_role)

const DEFAULT_RENDER = (e?: React.ReactText) => e

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
      children = '',
      style,
      color,
      background,
      type = 'default',
      appearance = 'filled',
      size = 'md',
      shape = 'square',
      closeable = false,
      editable = false,
      onDelete,
      onEdit,
      autoEditable = false,
      maxWidth,
      render = DEFAULT_RENDER,
      ...rest
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
          setEditValueCache(String(children))
          setIsInEdit(true)
        }
      },
      // 此处请不要添加任何作为依赖，autoEditable 只会在组件创建时起作用
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          `${prefixCls}--shape-${shape}`,
          {
            [`${prefixCls}--editable`]: editable,
            [`${prefixCls}--in-edit`]: editable && isInEdit,
            [`${prefixCls}--hover-enable`]: editable || closeable,
          }
        ),
      [prefixCls, className, type, appearance, size, editable, isInEdit, closeable, shape]
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
                title: render(children as React.ReactText),
                trigger: 'hover',
              },
            }
          : {
              component: React.Fragment,
              componentProps: {},
            },
      [isShowPopover, children, isInEdit, render]
    )

    if (__DEV__) {
      if (editable) {
        invariant(
          typeof children === 'string',
          'The children prop should be `string` when editable enabled in Tag component.'
        )
      }
    }

    return (
      <WrapperComponent {...(componentProps as any)}>
        <div ref={ref} role={role} className={rootClassName} style={rootStyle} {...rest}>
          <div className={`${prefixCls}__content-wrapper`}>
            <div className={`${prefixCls}__content`} ref={contentRef}>
              {isInEdit ? editValueCache : render(children as React.ReactText)}
            </div>
            {editable && isInEdit && (
              <input
                className={`${prefixCls}__input`}
                autoFocus
                value={editValueCache}
                onChange={(evt) => {
                  evt.stopPropagation()
                  setEditValueCache(evt.target.value)
                }}
                onBlur={(evt) => {
                  evt.stopPropagation()
                  setIsInEdit(false)
                  onEdit?.(evt.target.value)
                }}
              />
            )}
            {editable && !isInEdit && (
              <div
                className={`${prefixCls}__double-click-trigger`}
                onDoubleClick={(e) => {
                  setEditValueCache(String(children))
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
   * 类型状态
   * @default 'default'
   */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /**
   * 外观
   * @default 'solid'
   */
  appearance?: 'line' | 'solid' | 'filled'
  /**
   * 形状
   * @default 'square'
   */
  shape?: 'square' | 'round'
  /**
   * 标签尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 标签文字颜色
   */
  color?: string
  /**
   * 标签背景色
   */
  background?: string
  /**
   * 内容渲染器
   * @param children 子代对象
   * @default e => e
   */
  render?: (children?: React.ReactText) => React.ReactNode
  /**
   * 是否展示可关闭按钮
   * @default false
   */
  closeable?: boolean
  /**
   * 是否可编辑，若启用需要确保 children 传入类型为 `string`
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
   * 最大宽度，如超出，则截断末尾添加省略号，鼠标悬浮气泡展示（当使用此功能时，请保证children为纯文本类型）
   * @default 0 代表不限制宽度
   */
  maxWidth?: number
}

if (__DEV__) {
  Tag.displayName = 'Tag'
}

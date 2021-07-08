import React, { forwardRef, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TagProps, Tag } from './Tag'

const _role = 'tag-group'
const _prefix = getPrefixCls(_role)

/**
 * 标签 用来标记信息的属性，用以区分信息
 */
export const TagGroup = forwardRef<HTMLDivElement | null, TagGroupProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      data,
      editable: componentLevelEditable = false,
      onEdit,
    },
    ref
  ) => {
    const rootClassName = useMemo(() => cx(prefixCls, className), [prefixCls, className])

    const [nowEditNodeId, setNowEditNodeId] = useState<string | number>()
    const [editValueCache, setEditValueCache] = useState('')

    const renderTag = (info: TagGroupNode, index: number) => {
      const { id, editable = false, closeable = false, content, className, ...other } = info
      const canBeEdit = componentLevelEditable && editable
      const isInEdit = id === nowEditNodeId

      return (
        <Tag
          {...other}
          className={cx(`${prefixCls}__node`, className, {
            [`${prefixCls}__node--editable`]: editable,
            [`${prefixCls}__node--in-edit`]: canBeEdit && isInEdit
          })}
          key={id}
        >
          <div className={cx(`${prefixCls}__node__content-wrapper`)}>
            <div
              className={cx(`${prefixCls}__node__content`, {
                [`${prefixCls}__node__content--in-edit`]: canBeEdit && isInEdit,
              })}
            >
              {canBeEdit && isInEdit ? editValueCache : content}
            </div>
            {canBeEdit && isInEdit && (
              <input
                className={`${prefixCls}__node__input`}
                autoFocus
                value={editValueCache}
                onChange={(e) => setEditValueCache(e.target.value)}
                onBlur={(e) => {
                  setNowEditNodeId(undefined)
                  onEdit && onEdit(e.target.value, index)
                }}
              />
            )}
          </div>
          {canBeEdit && !isInEdit && (
            <div
              className={`${prefixCls}__node__double-click-trigger`}
              onDoubleClick={() => {
                setEditValueCache(content)
                setNowEditNodeId(id)
              }}
            />
          )}
        </Tag>
      )
    }
    return (
      <div ref={ref} role={role} className={rootClassName} style={style}>
        {(data || []).map(renderTag)}
      </div>
    )
  }
)

export interface TagGroupNode extends Omit<TagProps, 'children' | 'onClick'> {
  /**
   * 节点内容
   */
  content: string
  /**
   * 节点 id
   */
  id: string | number
  /**
   * 是否展示关闭按钮
   */
  closeable?: boolean
  /**
   * 是否允许编辑
   */
  editable?: boolean
}

export interface TagGroupProps {
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
   * 数据源
   */
  data?: TagGroupNode[]
  /**
   * 标签组是否可以编辑
   */
  editable?: boolean
  /**
   * 新增 tag 操作
   * @param content tag 内容
   * @param index 新增下标索引
   */
  onAdd?: (content: string, index: number) => void
  /**
   * tag 修改操作
   * @param content tag 修改后内容
   * @param index 修改下标索引
   */
  onEdit?: (content: string, index: number) => void
  /**
   * tag 删除操作
   * @param index 删除下标索引
   */
  onDelete?: (index: number) => void
}

if (__DEV__) {
  TagGroup.displayName = 'TagGroup'
}

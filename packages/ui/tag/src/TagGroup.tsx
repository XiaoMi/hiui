import React, { forwardRef, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { PlusOutlined } from '@hi-ui/icons'
import { Tag, TagProps } from './Tag'
import { __DEV__ } from '@hi-ui/env'
import { Button } from '@hi-ui/button'

const _role = 'tag-group'
const _prefix = getPrefixCls(_role)

export const TagGroup = forwardRef<HTMLDivElement | null, TagGroupProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data,
      maxWidth,
      style,
      editable = true,
      onAdd,
      onDelete,
      onEdit,
    },
    ref
  ) => {
    const rootClassName = useMemo(() => cx(className, prefixCls), [className, prefixCls])
    const [isInAdding, setIsInAdding] = useState(false)

    const displayTags = useMemo(() => {
      return data.map((item, index) => {
        const {
          closeable: itemCloseable,
          maxWidth: itemMaxWidth,
          editable: itemEditable,
          tagId,
          onDelete: itemOnDelete,
          onEdit: itemOnEdit,
          className: itemClassName,
          ...restItemProps
        } = item
        return (
          <Tag
            {...restItemProps}
            className={cx(itemClassName, `${prefixCls}__item`)}
            key={tagId}
            closeable={itemCloseable === undefined ? editable : itemCloseable}
            editable={itemEditable === undefined ? editable : itemEditable}
            maxWidth={itemMaxWidth === undefined ? maxWidth : itemMaxWidth}
            onDelete={() => {
              itemOnDelete && itemOnDelete()
              onDelete && onDelete({ ...item }, index)
            }}
            onEdit={(e) => {
              itemOnEdit && itemOnEdit(e)
              onEdit && onEdit(e, { ...item }, index)
            }}
          />
        )
      })
    }, [data, editable, maxWidth, onDelete, onEdit, prefixCls])

    const addNewButton = useMemo(() => {
      return (
        <div className={`${prefixCls}__add-new-button`}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            appearance="link"
            onClick={() => setIsInAdding(true)}
          >
            添加
          </Button>
        </div>
      )
    }, [prefixCls])

    return (
      <div ref={ref} role={role} className={rootClassName} style={style}>
        {displayTags}
        {editable && !isInAdding && addNewButton}
        {isInAdding && (
          <Tag
            autoEditable
            editable
            onEdit={(e) => {
              onAdd && onAdd(e, data.length)
              setIsInAdding(false)
            }}
            className={`${prefixCls}__item`}
          />
        )}
      </div>
    )
  }
)

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
   * 展示数据
   */
  data: TagGroupNode[]
  /**
   * 标签组是否可以修改、新增、删除，优先级低于 node 自定义
   * @default true
   */
  editable?: boolean
  /**
   * 最大宽度（优先级低于 node 自行定义）
   * @default 0 代表不限制宽度
   */
  maxWidth?: number
  /**
   * 标签删除后触发
   * @param deleteNode
   * @param index
   */
  onDelete?: (disposeNode: TagGroupNode, index: number) => void
  /**
   * 标签修改后触发
   * @param editNode
   * @param index
   */
  onEdit?: (newStringValue: string, disposeNode: TagGroupNode, index: number) => void
  /**
   * 标签新增后触发
   */
  onAdd?: (newStringValue: string, index: number) => void
}

export interface TagGroupNode extends Omit<TagProps, 'role' | 'prefixCls' | 'autoEditable'> {
  /**
   * 标签唯一 id
   */
  tagId: string | number
}

if (__DEV__) {
  TagGroup.displayName = 'TagGroup'
}

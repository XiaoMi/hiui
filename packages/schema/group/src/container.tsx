import React from 'react'
import { cx } from '@hi-ui/classname'
import { Collapse, type CollapseProps } from '@hi-ui/collapse'
import { mergeProps } from '@hi-ui/schema-utils'
import type { GroupConfigType } from '@hi-ui/schema-core'
import { getCollapseProps } from './_utils'
import './index.scss'

// @doc-comment-start code-block
// ---
// title: GroupContainerProps
// api:
//   for: group.basic
//   order: 20
// ---
export type GroupContainerProps = {
  groups: GroupConfigType[]
  /** 是否给全部子元素增加边框，默认开启 */
  bordered?: boolean
  className?: string
  collapseProps?: Partial<Omit<CollapseProps, 'className'>>
}
// @doc-comment-end code-block

export function GroupContainer(props: React.PropsWithChildren<GroupContainerProps>) {
  const className = cx('group-container', props.className)

  // 是否给全部子元素增加边框，默认开启
  const bordered = props.bordered ?? true

  const groupsLen = props.groups.length || 0
  /** 标记子元素数量 */
  const elType = groupsLen === 0 ? 'empty' : groupsLen > 1 ? 'multiple' : 'single'

  // TODO 确认能否由HiUI底层提供 defaultExpandAll
  const collapseIds = props.groups
    .map((group) => getCollapseProps(group)?.id)
    .filter((id) => id !== undefined)
  const enableCollapse = collapseIds.length > 0

  if (enableCollapse) {
    const collapseProps = mergeProps(
      {
        // size: 'sm', // v5中 sm 的尺寸缩小为12px，此处改为默认的 md
        bordered: false, // 是给折叠面板的容器加的边框，默认隐藏
      },
      props.collapseProps
    )

    return (
      <Collapse
        {...collapseProps}
        className={className}
        defaultActiveId={collapseIds}
        data-el-type={elType}
        data-bordered={bordered}
      >
        {props.children}
      </Collapse>
    )
  }

  return (
    <div className={className} data-el-type={elType} data-bordered={bordered}>
      {props.children}
    </div>
  )
}

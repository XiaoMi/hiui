import React from 'react'
import { cx } from '@hi-ui/classname'
import { Card } from '@hi-ui/card'
import { CollapsePanel } from '@hi-ui/collapse'
import { Actions, type ActionsProps } from '@hi-ui/schema-action-trigger'
import { getDataSet } from '@hi-ui/schema-utils'
import type { GroupConfigType } from '@hi-ui/schema-core'
import { getCardProps, getCollapseProps } from './_utils'
import './index.scss'

export type GroupPanelProps = {
  group: GroupConfigType
  actions?: ActionsProps['actions']
  className?: string
  dataSet?: Record<string, Primitive | undefined>
  ctx?: AnyObject
}

export function GroupPanel(props: React.PropsWithChildren<GroupPanelProps>) {
  const { group } = props

  // 标题元素
  const showTitle = !group.control?.hideTitle
  const titleEl = showTitle ? group.title : null
  const subTitleEl = showTitle ? group.subTitle : null

  const className = cx('group-panel', props.className)
  const dataSet = getDataSet(props.dataSet)

  // 展示标题时，并且有 actions 配置时，渲染 extraEl
  const extraEl = showTitle && !!props.actions && (
    // extraEl
    <Actions actions={props.actions} data={{}} ctx={props.ctx || {}} />
  )

  // 组元素的边框，没有默认值
  const bordered = group.control?.bordered

  const collapsePanelProps = getCollapseProps(group)
  if (collapsePanelProps) {
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
    }
    const collapseExtraEl = extraEl ? (
      <div onClick={stopPropagation} style={{ marginRight: 8 }}>
        {extraEl}
      </div>
    ) : null

    return (
      <CollapsePanel
        extra={collapseExtraEl}
        {...collapsePanelProps}
        title={titleEl}
        // subtitle={subTitleEl} // 折叠面板不支持副标题
        className={className}
        {...dataSet}
        data-group-type={group.type}
        data-group-name={group._titleText}
        data-group-key={group.dataIndex}
        data-bordered={bordered}
        data-readonly={group.control?.readonly}
      >
        {props.children}
      </CollapsePanel>
    )
  }

  const cardProps = getCardProps(group)
  return (
    <Card
      {...cardProps}
      bordered={false} // 禁用卡片上的边框
      title={titleEl}
      subtitle={subTitleEl}
      className={className}
      extra={extraEl}
      {...dataSet}
      data-group-type={group.type}
      data-group-name={group._titleText}
      data-group-key={group.dataIndex}
      data-bordered={bordered}
      data-readonly={group.control?.readonly}
    >
      {props.children}
    </Card>
  )
}

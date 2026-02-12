import React from 'react'
import Card from '@hi-ui/card'
import { GroupContainer, type GroupContainerProps } from '@hi-ui/group'
import { Actions, type ActionsProps } from '@hi-ui/schema-action-trigger'
import type { GroupConfigType } from '@hi-ui/schema-core'
import type { UseGroupMapOpts } from '../group-context/ctx'
import { SchemaGroupCtx } from './ctx'
import { usePropsRef } from './hooks/use-props'
import { SchemaGroupRender } from './render'
import { cls } from './_utils'
import './index.scss'

// @doc-comment-start code-block
// ---
// title: SchemaGroupProps
// api:
//   for: group.basic
//   order: 10
// ---
export type SchemaGroupProps = UseGroupMapOpts & {
  title?: {
    titleText: React.ReactNode
    subtitleText?: React.ReactNode
    actions?: ActionsProps['actions']
    // TODO 待增加 portal 渲染支持
    portal?: React.ReactPortal
  }
  groups: GroupConfigType[]
  className?: string
  // dataSource?: AnyObject
  /** 是否给全部【组】元素增加边框，默认开启 */
  borderedGroups?: GroupContainerProps['bordered']
  /** 透传的组容器配置 */
  collapseProps?: GroupContainerProps['collapseProps']
}
// @doc-comment-end code-block

export function SchemaGroup(props: SchemaGroupProps) {
  const { propsRef } = usePropsRef(props)

  const groupCtx = React.useMemo(() => {
    return {
      propsRef,
    }
  }, [propsRef])

  if (!propsRef.current.groups?.length) return <div>未配置组</div>
  if (!propsRef.current.groupMap) return <div>未配置组渲染器映射</div>

  return (
    <SchemaGroupCtx.Provider value={groupCtx}>
      <div className={propsRef.current.className} data-group-type="group">
        {!!props.title && (
          <Card
            className={cls('title')}
            title={props.title.titleText}
            subtitle={props.title.subtitleText}
            extra={
              !!props.title.actions && (
                <Actions
                  // Actions
                  actions={props.title.actions}
                  data={{}}
                  ctx={{}} // TODO 确认 SchemaGroup 的上下文传点啥呢
                />
              )
            }
            bordered={false} // 禁用卡片上的边框
            data-bordered={propsRef.current.borderedGroups}
          ></Card>
        )}

        <GroupContainer
          groups={props.groups}
          className={cls('container')}
          bordered={propsRef.current.borderedGroups}
          collapseProps={propsRef.current.collapseProps}
        >
          <SchemaGroupRender groups={props.groups} />
        </GroupContainer>
      </div>
    </SchemaGroupCtx.Provider>
  )
}

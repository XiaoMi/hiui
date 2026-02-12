import React from 'react'
import Tabs, { type TabsProps } from '@hi-ui/tabs'
import { GroupContainer, GroupPanel, getGroupId } from '@hi-ui/group'
import { GridHelper, type GridHelperProps } from '@hi-ui/schema-auto-grid'
import { mergeProps } from '@hi-ui/schema-utils'
import type { ElGroupType, GroupConfigType, GroupRendererConfigType } from '@hi-ui/schema-core'
import { matchGroupRenderer } from '../group-context/ctx'
import { useSchemaGroupCtx } from './ctx'
import { resolveChildGroups } from './utils'
import { cls } from './_utils'

export type SchemaGroupRenderProps = {
  groups: GroupConfigType[]
  /** 嵌套层级 */
  nestLevel?: number
}

export function SchemaGroupRender(props: SchemaGroupRenderProps) {
  const { groups } = props
  const { propsRef } = useSchemaGroupCtx()
  const { groupMap } = propsRef.current

  if (!groups?.length) return <></>

  const children = groups.map((group, index) => {
    if (group.type === 'simple') return null

    const className = cls(`panel`)
    const { nestLevel = 1 } = props

    if (group.type === 'custom') {
      const config = group.config as GroupRendererConfigType['custom']

      return (
        <GroupPanel
          // GroupPanel
          key={index}
          group={group}
          actions={config.actions}
          className={className}
          dataSet={{ nestLevel }}
        >
          {config.render()}
        </GroupPanel>
      )
    }

    if (group.type === 'tabs') {
      return (
        <TabsRender
          // TabsRender
          key={index}
          group={group as GroupConfigType<'tabs'>}
          nestLevel={nestLevel}
        />
      )
    }

    if (group.type === 'grid') {
      return (
        <GridRender
          // grid
          key={index}
          group={group as GroupConfigType<'grid'>}
          nestLevel={nestLevel}
        />
      )
    }

    const MatchedGroupRenderer = matchGroupRenderer({ group, groupMap })
    if (!MatchedGroupRenderer) return null

    const config = group.config as GroupRendererConfigType[ElGroupType]
    return (
      <GroupPanel
        // GroupPanel
        key={index}
        group={group}
        actions={config.actions}
        className={className}
        dataSet={{ nestLevel }}
      >
        <MatchedGroupRenderer
          dataIndex={group.dataIndex}
          // @ts-expect-error FieldConfigType 在不同场景下类型有细微不同，忽略
          fields={config.fields}
          {...config.props}
        />
      </GroupPanel>
    )
  })

  return <>{children}</>
}

type TabsRenderProps = {
  group: GroupConfigType<'tabs'>
  nestLevel?: SchemaGroupRenderProps['nestLevel']
}

function TabsRender(props: TabsRenderProps) {
  const { group, nestLevel = 1 } = props
  const { propsRef } = useSchemaGroupCtx()
  const config = group.config as GroupRendererConfigType['tabs']

  // extra 本质是对象，但此处需要直接替换，因此先从 config.props 中解构出来，再合并到 Tabs 的 props 中
  const { extra: extraProp, ...restProps } = config.props || {}
  const extraEl = extraProp ? <div className={cls('panel_tabs-extra')}>{extraProp}</div> : null

  const tabsProps = mergeProps(
    {
      type: config.type,
      defaultActiveId: config.defaultActiveId,
    },
    restProps as TabsProps,
    {
      extra: extraEl,
    }
  )

  /** 标记是否存在复杂的标签页 */
  // 复杂的标签页：一个标签页内嵌套了多个子组
  const hasComplexChild = config.children?.some((child) => (child.groups?.length || 0) > 1)

  return (
    <GroupPanel
      // GroupPanel
      group={group}
      actions={config.actions}
      className={cls('panel')}
      dataSet={{ nestLevel, hasComplexChild }}
    >
      <Tabs {...tabsProps}>
        {config.children?.map((child, index) => {
          const tabProps = mergeProps(
            {
              tabId: getGroupId(child),
              tabTitle: child.title,
            },
            child.wrapperProps
          )

          const groups = resolveChildGroups(child)
          return (
            <Tabs.Pane key={index} {...tabProps}>
              <GroupContainer
                groups={groups}
                className={cls('tab-pane_container')}
                bordered={propsRef.current.borderedGroups}
                collapseProps={propsRef.current.collapseProps}
              >
                <SchemaGroupRender groups={groups} nestLevel={nestLevel + 1} />
              </GroupContainer>
            </Tabs.Pane>
          )
        })}
      </Tabs>
    </GroupPanel>
  )
}

type GridRenderProps = {
  group: GroupConfigType<'grid'>
  nestLevel?: SchemaGroupRenderProps['nestLevel']
}

function GridRender(props: GridRenderProps) {
  const { group, nestLevel = 1 } = props
  const { propsRef } = useSchemaGroupCtx()
  const config = group.config

  const nodes: GridHelperProps['nodes'] = config.children?.map((child) => {
    const groups = resolveChildGroups(child)

    const elem = (
      <GroupContainer
        groups={groups}
        className={cls('grid-col_container')}
        bordered={propsRef.current.borderedGroups}
        collapseProps={propsRef.current.collapseProps}
      >
        <SchemaGroupRender groups={groups} nestLevel={nestLevel + 1} />
      </GroupContainer>
    )

    return {
      key: getGroupId(child),
      elem,
      props: child.wrapperProps,
    }
  })

  return (
    <GroupPanel
      group={group}
      actions={config.actions}
      className={cls('panel')}
      dataSet={{ nestLevel }}
    >
      <GridHelper
        nodes={nodes}
        columnCount={config.columnCount}
        gutter={config.gutter ?? 12}
        rowGap={config.rowGap ?? 12}
        {...config.props}
      ></GridHelper>
    </GroupPanel>
  )
}

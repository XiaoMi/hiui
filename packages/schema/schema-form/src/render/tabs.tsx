import React from 'react'
import Tabs, { type TabsProps } from '@hi-ui/tabs'
import { GroupContainer, GroupPanel, getGroupId } from '@hi-ui/group'
import { mergeProps } from '@hi-ui/schema-utils'
import type { GroupConfigType, GroupRendererConfigType } from '@hi-ui/schema-core'
import { useSchemaFormCtx } from '../ctx'
import { cls } from '../_utils'
import { GroupedNestFields, useRenderCtx } from './ctx'
import { GroupedSchemaFormRender, type BasicRenderProps } from './index'
import { matchGroupsAndFields } from './utils'

type TabsRenderProps = {
  group: GroupConfigType<'tabs'>
  groupIndex: number
  nestLevel?: BasicRenderProps['nestLevel']
}

export function TabsGroupRender(props: TabsRenderProps) {
  const { group, nestLevel = 1 } = props
  const { propsRef } = useSchemaFormCtx()
  const config = group.config as GroupRendererConfigType['tabs']
  const ctxGroupedFields = useRenderCtx().groupedFieldsRef.current
  const selfGroupedFields = ctxGroupedFields[props.groupIndex] as GroupedNestFields

  // extra 本质是对象，但此处需要直接替换，因此先从 config.props 中解构出来，再合并到 Tabs 的 props 中
  const { extra: extraProp, ...restProps } = config.props || {}
  const extraEl = extraProp ? (
    <div className={cls('group-panel_tabs-extra')}>{extraProp}</div>
  ) : null

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
      className={cls('group-panel')}
      dataSet={{ nestLevel, hasComplexChild }}
    >
      <Tabs {...tabsProps}>
        {config.children?.map((child, childIndex) => {
          const tabProps = mergeProps(
            {
              tabId: getGroupId(child),
              tabTitle: child.title,
            },
            child.wrapperProps
          )

          const { groups, groupedFields } = matchGroupsAndFields({
            childGroup: child,
            childIndex,
            groupedFields: selfGroupedFields,
          })
          return (
            // TODO 此处有遗留问题，未激活的标签页中的表单项无法被正确校验
            // 暂时没有很好的办法，须告知使用者在提交时再进行一步额外校验！！！
            <Tabs.Pane key={childIndex} {...tabProps} unmountOnInactive={false}>
              <GroupContainer
                groups={groups}
                className={cls('tab-pane_container')}
                bordered={propsRef.current.borderedGroups}
                collapseProps={propsRef.current.collapseProps}
              >
                <GroupedSchemaFormRender
                  groups={groups}
                  groupedFields={groupedFields}
                  nestLevel={nestLevel + 1}
                />
              </GroupContainer>
            </Tabs.Pane>
          )
        })}
      </Tabs>
    </GroupPanel>
  )
}

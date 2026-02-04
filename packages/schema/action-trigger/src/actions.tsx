import React from 'react'
import { isValidElementType } from 'react-is'
import { cx } from '@hi-ui/classname'
import { Space, type SpaceProps } from '@hi-ui/space'
import { ActionTrigger } from './trigger'
import { MoreActionTrigger } from './more'
import { unifiedActionsCls as clsPrefix } from './_utils'
import type { ActionConfigType, ActionTriggerProps, WithActionCtx } from './trigger'
import './index.scss'

export type ActionElEnumType =
  | 'primitive' // 原始值
  | 'jsx' // JSX 元素
  | 'component' // 自定义组件
  | 'config' // 配置对象
  | 'more' // 更多

export type ActionElType = {
  type: ActionElEnumType
  jsx: React.ReactElement
}

export type ActionComponentType<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = React.ComponentType<{ data: TData; ctx: TCtx }>

export type ActionsProps<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = WithActionCtx<
  {
    /** 按钮配置 */
    actions: (
      | ActionTriggerProps<TData, TCtx>
      | ActionComponentType<TData, TCtx>
      | React.ReactNode
    )[]
    /**
     * 最大显示数量
     * @desc 超过最大数量时，会显示【更多】按钮
     * @desc 默认显示全部，相当于 maxCount 为 Infinity
     */
    maxCount?: number
    className?: string
    direction?: SpaceProps['direction']
  },
  TData,
  TCtx
>

const primitiveTypeEnum = new Set([
  // primitive
  'string',
  'number',
  'boolean',
  'bigint',
  'symbol',
] as const)

export function Actions<
  // Actions
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
>(props: ActionsProps<TData, TCtx>) {
  const { data, ctx } = props

  const className = cx(clsPrefix, props.className)

  const actionEls = props.actions
    .map((action, index) => {
      if (!action) return null

      // 可以是【JSX 元素】
      if (React.isValidElement(action)) {
        return { type: 'jsx', jsx: action } as ActionElType
      }

      // 可以是【自定义组件】
      if (isValidElementType(action)) {
        const ActionComponent = action as ActionComponentType<TData, TCtx>
        const el = (
          <ActionComponent
            // ActionComponent
            key={ActionComponent.name || index}
            data={data}
            ctx={ctx}
          />
        )
        return { type: 'component', jsx: el } as ActionElType
      }

      // 可以是其他【原始值】
      // 这段其实大可不必，留着为了防刁钻的测试用例
      if (primitiveTypeEnum.has(typeof action as 'string')) {
        const str = action?.toString() || ''
        const el = <React.Fragment key={str}>{str}</React.Fragment>
        return { type: 'primitive', jsx: el } as ActionElType
      }

      // 保底是【操作配置对象】
      const actionConfig = action as ActionConfigType
      // JSX 写法无法判断 ActionTrigger 返回是否为 null，因此使用函数写法
      const el = ActionTrigger({ ...actionConfig, data, ctx })
      if (!el) return null
      else return { type: 'config', jsx: el } as ActionElType
    })
    .filter((action) => !!action)

  const { maxCount: sliceStart = Infinity } = props
  const startEls = actionEls.slice(0, sliceStart)
  const moreEls = actionEls.slice(sliceStart)
  if (moreEls.length > 0) {
    startEls.push({
      type: 'more',
      jsx: <MoreActionTrigger key="more" els={moreEls} />,
    })
  }

  return (
    <Space direction={props.direction} className={className}>
      {startEls.map(({ jsx }) => jsx)}
    </Space>
  )
}

// TODO 此处暂时留一个占位，等待后续扩展

// type DynamicCountWrapperProps = {
//   wrapperEl: React.RefObject<HTMLElement>
//   children: React.ReactElement
// }

// export function DynamicCountWrapper(props: DynamicCountWrapperProps) {
//   // TODO 此处根据 wrapperEl 的宽度计算 maxCount
//   return React.cloneElement(props.children, {
//     maxCount: 2,
//   })
// }

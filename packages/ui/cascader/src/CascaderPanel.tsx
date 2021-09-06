import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger, CascaderItemEventData, FlattedCascaderItem } from './types'
import { CascaderProvider } from './context'
import { useCascader } from './use-cascader'
import { CascaderSearch, CascaderMenuList } from './Cascader'
import { HiBaseHTMLProps } from 'packages/core/core/lib/types'

const _role = 'cascader-panel'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderPanel
 * MenuList + Search
 */
export const CascaderPanel = forwardRef<HTMLDivElement | null, CascaderPanelProps>(
  ({ prefixCls = _prefix, role = _role, className, searchable = false, ...rest }, ref) => {
    const { rootProps, ...context } = useCascader(rest)

    const providedValue = useMemo(() => context, [context])

    const cls = cx(
      prefixCls,
      className,
      context.flatted && `${prefixCls}--flatted`,
      context.changeOnSelect && `${prefixCls}--selectchange`
    )

    return (
      <CascaderProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          {searchable ? <CascaderSearch /> : null}
          <CascaderMenuList />
        </div>
      </CascaderProvider>
    )
  }
)

export type CascaderPanelProps = HiBaseHTMLProps<
  'div',
  {
    /**
     * 设置选择项数据源
     */
    data: CascaderItem[]
    /**
     * 设置当前多选值
     */
    value?: React.ReactText
    /**
     * 设置当前多选值默认值
     */
    defaultValue?: React.ReactText
    /**
     * 多选值改变时的回调
     * TODO: 是否有这样的需求：暴露操作的原始数据对象？包括 点击选型、点击清空按钮
     */
    onChange?: (
      value: React.ReactText,
      targetOption: CascaderItemEventData,
      optionPaths: FlattedCascaderItem[]
    ) => void
    /**
     * 选中选项时触发，仅供内部使用
     */
    onSelect?: (
      value: React.ReactText,
      targetOption: CascaderItemEventData,
      optionPaths: FlattedCascaderItem[]
    ) => void
    /**
     * 次级菜单的展开方式
     */
    expandTrigger?: ExpandTrigger
    /**
     * 是否可搜索（仅在 title 为字符串时支持）
     */
    searchable?: boolean
    /**
     * 是否禁止使用
     */
    disabled?: boolean
    /**
     * 设置选项为空时展示的内容
     */
    emptyContent?: React.ReactNode
    /**
     * 是否启用选择即改变功能
     */
    changeOnSelect?: boolean
    /**
     * 自定义渲染节点的 title 内容
     */
    titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
    /**
     * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
     */
    displayRender?: (
      checkedOption: FlattedCascaderItem,
      checkedOptions: FlattedCascaderItem[]
    ) => React.ReactNode
    /**
     * 将 check 子项拍平展示
     */
    flatted?: boolean
    /**
     * 开启全量搜索，默认只对开启 checkable 的选项进行搜索，不向上查找路径
     */
    upMatch?: boolean
    /**
     * 搜索输入框占位符
     */
    searchPlaceholder?: string
    /**
     * 异步请求更新数据
     */
    onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
  }
>

if (__DEV__) {
  CascaderPanel.displayName = 'CascaderPanel'
}

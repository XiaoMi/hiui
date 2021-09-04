import React, { forwardRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { DownOutlined } from '@hi-ui/icons'
import { CascaderPanel } from './CascaderPanel'
import { Popper, PopperProps } from '@hi-ui/popper'
import { CascaderItem, ExpandTrigger, CascaderItemEventData, FlattedCascaderItem } from './types'
import Input from '@hi-ui/input'
import { flattenTreeData, getNodeAncestors } from './utils'

const _role = 'cascader'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Cascader
 */
export const Cascader = forwardRef<HTMLDivElement | null, CascaderProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      defaultValue = '',
      value: valueProp,
      onChange,
      data,
      placeholder,
      clearable,
      expandTrigger,
      searchable,
      disabled,
      emptyContent,
      changeOnSelect,
      titleRender,
      displayRender,
      flatted,
      upMatch,
      searchPlaceholder,
      onLoadChildren,
      popper,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const flattedData = useMemo(() => flattenTreeData(data), [data])

    const [menuVisible, menuVisibleAction] = useToggle()
    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <Input
          ref={setTargetElRef}
          readOnly
          // 获取 value 对应的路径数据
          value={value}
          onChange={tryChangeValue}
          disabled={disabled}
          clearable={clearable}
          placeholder={placeholder}
          displayRender={displayRender}
          suffix={<DownOutlined className={`${prefixCls}__suffix`} />}
          onClick={() => {
            if (disabled) return
            menuVisibleAction.on()
          }}
        />

        <Popper
          {...popper}
          attachEl={targetElRef}
          visible={menuVisible}
          onClose={menuVisibleAction.off}
        >
          <CascaderPanel
            value={value}
            onChange={tryChangeValue}
            // 向下传递
            {...{
              data,
              flattedData,
              expandTrigger,
              searchable,
              disabled,
              emptyContent,
              changeOnSelect,
              titleRender,
              flatted,
              upMatch,
              placeholder: searchPlaceholder,
              onLoadChildren,
            }}
          />
        </Popper>
      </div>
    )
  }
)

export interface CascaderProps {
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
   * TODO: 是否有这样的需求：暴露操作的原始数据对象？包括 点击 checkbox、点击 tag 删除按钮、点击清空按钮
   */
  onChange?: (value: React.ReactText) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
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
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (checkedOption: FlattedCascaderItem) => React.ReactNode
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean
  /**
   * 开启全量搜索，默认只对开启 checkable 的选项进行搜索，不向上查找路径
   */
  upMatch?: boolean
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 搜索输入框占位符
   */
  searchPlaceholder?: string
  /**
   * 异步请求更新数据
   */
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
  /**
   * 自定义控制 popper 行为
   */
  popper?: PopperProps
}

if (__DEV__) {
  Cascader.displayName = 'Cascader'
}

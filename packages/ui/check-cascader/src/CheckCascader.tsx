import React, { forwardRef, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { usePopper } from 'react-popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { DownOutlined } from '@hi-ui/icons'
import { CheckCascaderPanel } from './CheckCascaderPanel'
import { TagInput } from './TagInput'
import {
  CheckCascaderItem,
  ExpandTrigger,
  CheckCascaderItemEventData,
  FlattedCheckCascaderItem,
} from './types'

const _role = 'check-cascader'
const _prefix = getPrefixCls(_role)
const NOOP_ARRAY = [] as []

/**
 * TODO: What is CheckCascader
 */
export const CheckCascader = forwardRef<HTMLDivElement | null, CheckCascaderProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      defaultValue = NOOP_ARRAY,
      value: valueProp,
      onChange,
      data,
      placeholder,
      clearable,
      onSelect,
      expandTrigger,
      searchable,
      disabled,
      emptyContent,
      changeOnSelect,
      titleRender,
      displayRender,
      checkCascaded,
      flatted,
      upMatch,
      searchPlaceholder,
      onLoadChildren,
      wrap,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const [menuVisible, menuVisibleAction] = useToggle()

    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)
    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const cascaderRef = useRef<HTMLDivElement | null>(null)

    useOutsideClick(cascaderRef, menuVisibleAction.off)

    const { styles, attributes } = usePopper(targetElRef, popperElRef.current, {
      placement: 'bottom-start',
      modifiers: [
        {
          enabled: true,
          name: 'arrow',
          options: {
            element: arrowElRef,
          },
        },
        {
          enabled: true,
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    })

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    return (
      <div ref={useMergeRefs(ref, cascaderRef)} role={role} className={cls} {...rest}>
        <TagInput
          ref={setTargetElRef}
          data={data}
          value={value}
          onChange={tryChangeValue}
          disabled={disabled}
          clearable={clearable}
          placeholder={placeholder}
          displayRender={displayRender}
          wrap={wrap}
          suffix={<DownOutlined className={`${prefixCls}__suffix`} />}
          onClick={(evt) => {
            if (disabled) return

            evt.stopPropagation()
            menuVisibleAction.on()
          }}
        />

        {menuVisible ? (
          <div
            className={`${prefixCls}__modal`}
            ref={popperElRef}
            style={{ ...styles.popper, zIndex: 2 }}
            {...attributes.popper}
          >
            <div ref={setArrowElmRef} style={styles.arrow} />
            <CheckCascaderPanel
              value={value}
              onChange={tryChangeValue}
              // 向下传递
              {...{
                data,
                onSelect,
                expandTrigger,
                searchable,
                disabled,
                emptyContent,
                changeOnSelect,
                titleRender,
                checkCascaded,
                flatted,
                upMatch,
                placeholder: searchPlaceholder,
                onLoadChildren,
              }}
            />
          </div>
        ) : null}
      </div>
    )
  }
)

export interface CheckCascaderProps {
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
  data: CheckCascaderItem[]
  /**
   * 设置当前多选值
   */
  value?: React.ReactText[]
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 多选值改变时的回调
   */
  onChange?: (
    values: React.ReactText[],
    checkedOption: CheckCascaderItemEventData,
    checked: boolean
  ) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedId: React.ReactText, selectedOption: CheckCascaderItemEventData) => void
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
  titleRender?: (item: CheckCascaderItemEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (checkedOption: FlattedCheckCascaderItem) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
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
  onLoadChildren?: (item: CheckCascaderItemEventData) => Promise<CheckCascaderItem[] | void> | void
  /**
   * 是否单行展示，超出 +1
   */
  wrap?: boolean
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}

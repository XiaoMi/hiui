import React, { forwardRef, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { usePopper } from 'react-popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { CheckCascaderPanel } from './CheckCascaderPanel'
import { defaultSuffixIcon } from './icons'
import { CheckCascaderItem, ExpandTrigger, FlattedCheckCascaderItem } from './types'
import { TagInput } from './TagInput'

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
      placeholder,
      ...rest
    },
    ref
  ) => {
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

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={useMergeRefs(ref, cascaderRef)}
        role={role}
        className={cls}
        onClick={(evt) => {
          evt.stopPropagation()
          menuVisibleAction.on()
        }}
      >
        <TagInput
          ref={setTargetElRef}
          placeholder={placeholder}
          value={value}
          onChange={tryChangeValue}
          suffix={defaultSuffixIcon}
        />

        {menuVisible ? (
          <div
            className={`${prefixCls}__modal`}
            ref={popperElRef}
            style={{ ...styles.popper, zIndex: 2 }}
            {...attributes.popper}
          >
            <div ref={setArrowElmRef} style={styles.arrow} />
            <CheckCascaderPanel value={value} onChange={tryChangeValue} {...rest} />
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
  onChange?: (values: React.ReactText[]) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedIds: React.ReactText[], item: CheckCascaderItem) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 是否有边框	boolean	true | false	true
   */
  appearance?: 'outlined'
  /**
   * 是否可清空	boolean	true | false	true
   */
  clearable?: boolean
  /**
   * 是否禁止使用	boolean	true | false	false
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
  titleRender?: (item: FlattedCheckCascaderItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (value: React.ReactText[][]) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean
  /**
   * 开启全量搜索，默认只对开启 checkable 的选项进行搜索
   */
  fullMatch?: boolean
  /**
   * 输入框占位符
   */
  placeholder?: string
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}

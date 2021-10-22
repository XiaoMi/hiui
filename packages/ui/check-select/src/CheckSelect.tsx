import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Input from '@hi-ui/input'
import { useToggle } from '@hi-ui/use-toggle'
import { useCheckSelect, UseSelectProps } from './use-check-select'
import type { HiBaseHTMLFieldProps, HiBaseHTMLProps } from '@hi-ui/core'
import Popper, { PopperProps } from '@hi-ui/popper'
import { DownOutlined, SearchOutlined } from '@hi-ui/icons'
import { CheckSelectProvider, useCheckSelectContext } from './context'
import { CheckSelectOptionItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import Checkbox from '@hi-ui/checkbox'
import { TagInput } from '@hi-ui/tag-input'
import { isFunction } from '@hi-ui/type-assertion'
import VirtualList from 'rc-virtual-list'

const _role = 'check-select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CheckSelect
 */
export const CheckSelect = forwardRef<HTMLDivElement | null, CheckSelectProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      disabled = false,
      clearable = false,
      searchable = false,
      invalid = false,
      placeholder,
      displayRender: displayRenderProp,
      onSelect: onSelectProp,
      height,
      itemHeight = 40,
      virtual = true,
      popper,
      ...rest
    },
    ref
  ) => {
    const [menuVisible, menuVisibleAction] = useToggle()
    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)

    const openMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.on()
    }, [disabled, menuVisibleAction])

    const onSelectLatest = useLatestCallback(onSelectProp)

    const displayRender = useCallback(
      (item: CheckSelectOptionItem) => {
        if (isFunction(displayRenderProp)) {
          return displayRenderProp(item)
        }

        return item.title
      },
      [displayRenderProp]
    )

    const { rootProps, ...context } = useCheckSelect({
      ...rest,
      children,
      onSelect: onSelectLatest,
    })

    const { value, tryChangeValue, data: selectData } = context

    const virtualData = useMemo(
      () =>
        selectData.reduce((acc, cur, index) => {
          if ('groupTitle' in cur) {
            acc.push({
              id: `group-${index}`,
              groupTitle: cur.groupTitle,
              rootProps: cur.rootProps,
            })
            return acc.concat(cur.children)
          }

          acc.push(cur)
          return acc
        }, []),
      [selectData]
    )

    const cls = cx(prefixCls, className)

    return (
      <CheckSelectProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          <TagInput
            ref={setTargetElRef}
            onClick={openMenu}
            disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            data={selectData}
            value={value}
            onChange={tryChangeValue}
            displayRender={displayRender}
            suffix={<DownOutlined />}
          />
          <Popper
            {...popper}
            attachEl={targetElRef}
            visible={menuVisible}
            onClose={menuVisibleAction.off}
          >
            <div className={`${prefixCls}-panel`}>
              {searchable ? <CheckSelectSearch /> : null}
              <VirtualList
                itemKey="id"
                fullHeight={false}
                height={height}
                itemHeight={itemHeight}
                virtual={virtual}
                data={virtualData}
              >
                {(node, index) => {
                  /* 反向 map，搜索删选数据时会对数据进行处理 */
                  return 'groupTitle' in node ? (
                    <CheckSelectOptionGroup label={node.groupTitle} {...node.rootProps} />
                  ) : (
                    <CheckSelectOption option={node} {...node.rootProps} />
                  )
                }}
              </VirtualList>
            </div>
          </Popper>
        </div>
      </CheckSelectProvider>
    )
  }
)

export interface CheckSelectProps
  extends Omit<HiBaseHTMLFieldProps<'div'>, 'onChange' | 'onSelect' | 'defaultValue'>,
    UseSelectProps {
  /**
   * 自定义控制 popper 行为
   */
  popper?: PopperProps
  /**
   * 设置虚拟滚动容器的可视高度
   */
  height?: number
  /**
   * 设置虚拟列表每项的固定高度
   */
  itemHeight?: number
  /**
   * 	设置 `true` 开启虚拟滚动
   */
  virtual?: boolean
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 是否点击清理 tags
   */
  onClear?: () => void
  /**
   * 自定义尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 面板打开时回调
   */
  onOpen?: () => void
  /**
   * 面板关闭时回调
   */
  onClose?: () => void
  /**
   * 自定义 input 后缀 icon
   */
  suffixIcon?: React.ReactNode
  /**
   * 自定义清除 tags 的 icon
   */
  clearIcon?: React.ReactNode
  /**
   * 是否其启用默认搜索，可自定义过滤函数结合 onSearch 实现根据搜索框内容，自定义搜索
   */
  filter?: boolean | (() => boolean)
}

// @ts-ignore
CheckSelect.HiName = 'CheckSelect'
if (__DEV__) {
  CheckSelect.displayName = 'CheckSelect'
}

const searchPrefix = getPrefixCls('check-select-search')

/**
 * TODO: What is CheckSelectSearch
 */
export const CheckSelectSearch = forwardRef<HTMLInputElement | null, SelectSearchProps>(
  ({ prefixCls = searchPrefix, className, ...rest }, ref) => {
    const { isEmpty, emptyContent, getSearchInputProps } = useCheckSelectContext()

    return (
      <div ref={ref} className={cx(prefixCls, className)} {...rest}>
        <Input {...getSearchInputProps()} appearance="underline" prefix={<SearchOutlined />} />
        {isEmpty ? <span className={`${prefixCls}__empty`}>{emptyContent}</span> : null}
      </div>
    )
  }
)

export interface SelectSearchProps extends HiBaseHTMLProps {}

if (__DEV__) {
  CheckSelectSearch.displayName = 'CheckSelectSearch'
}

const optionPrefix = getPrefixCls('check-select-option')

/**
 * TODO: What is CheckSelectOption
 */
export const CheckSelectOption = forwardRef<HTMLDivElement | null, CheckSelectOptionProps>(
  ({ prefixCls = optionPrefix, className, children, option = {}, onClick, ...rest }, ref) => {
    const { isSelectedId, onSelect, titleRender } = useCheckSelectContext()

    const checked = isSelectedId(option.id)
    const { disabled = false } = option
    const cls = cx(
      prefixCls,
      className,
      checked && `${prefixCls}--selected`,
      disabled && `${prefixCls}--disabled`
    )

    const handleOptionCheck = useCallback(
      (evt) => {
        onSelect(option, !checked)
        onClick?.(evt)
      },
      [onSelect, option, checked, onClick]
    )

    // 如果 titleRender 返回 `true`，则使用默认 title
    const title = titleRender ? titleRender({ ...option, checked }) : true

    return (
      <div ref={ref} className={cls} {...rest} onClick={handleOptionCheck}>
        {title === true ? (
          <Checkbox checked={checked} disabled={option.disabled}>
            {option.title}
          </Checkbox>
        ) : (
          title
        )}
      </div>
    )
  }
)

export interface CheckSelectOptionProps extends HiBaseHTMLProps {}

// @ts-ignore
CheckSelectOption.HiName = 'CheckSelectOption'
if (__DEV__) {
  CheckSelectOption.displayName = 'CheckSelectOption'
}

/**
 * TODO: What is CheckSelectOptionGroup
 */
export const CheckSelectOptionGroup = forwardRef<HTMLDivElement | null, CheckSelectOptionProps>(
  ({ prefixCls = optionPrefix, className, children, label, onClick, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} className={cls} {...rest}>
        <span>{label}</span>
      </div>
    )
  }
)

export interface CheckSelectOptionGroupProps extends HiBaseHTMLProps {}

// @ts-ignore
CheckSelectOptionGroup.HiName = 'CheckSelectOptionGroup'
if (__DEV__) {
  CheckSelectOptionGroup.displayName = 'CheckSelectOptionGroup'
}

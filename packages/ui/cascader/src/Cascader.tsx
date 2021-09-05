import React, { forwardRef, useState, useCallback, useMemo } from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useLatestRef } from '@hi-ui/use-latest'
import { useCascader } from './use-cascader'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import Input from '@hi-ui/input'
import { Popper, PopperProps } from '@hi-ui/popper'
import { DownOutlined, SearchOutlined } from '@hi-ui/icons'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import { getCascaderItemEventData, getNodeAncestors } from './utils'
import { CascaderProvider, useCascaderContext } from './context'
import { CascaderItem, ExpandTrigger, FlattedCascaderItem, CascaderItemEventData } from './types'

// Cascader:        Trigger | MenuList | Search
// CascaderPanel:   MenuList | Search

const _role = 'cascader'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Cascader
 */
export const Cascader = forwardRef<HTMLDivElement | null, CascaderProps>((props, ref) => {
  const {
    prefixCls = _prefix,
    role = _role,
    className,
    popper,
    onChange,
    disabled = false,
    searchable = false,
    ...rest
  } = props

  const [menuVisible, menuVisibleAction] = useToggle()
  const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)

  const openMenu = useCallback(() => {
    if (disabled) return
    menuVisibleAction.on()
  }, [disabled, menuVisibleAction])

  const onChangeRef = useLatestRef(onChange)
  const proxyOnChange = useCallback(
    (
      selectedId: React.ReactText,
      selectOption: CascaderItemEventData,
      optionPath: FlattedCascaderItem[]
    ) => {
      onChangeRef.current?.(selectedId, selectOption, optionPath)
      menuVisibleAction.off()
    },
    [menuVisibleAction, onChangeRef]
  )

  const { rootProps, ...context } = useCascader({
    ...rest,
    disabled,
    onChange: proxyOnChange,
  })

  const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

  return (
    <CascaderProvider value={context}>
      <div ref={ref} role={role} className={cls} {...rootProps}>
        <CascaderTrigger ref={setTargetElRef} onClick={openMenu} />
        <Popper
          {...popper}
          attachEl={targetElRef}
          visible={menuVisible}
          onClose={menuVisibleAction.off}
        >
          {searchable ? <CascaderSearch /> : null}
          <CascaderMenuList />
        </Popper>
      </div>
    </CascaderProvider>
  )
})

export interface CascaderProps extends Omit<HiBaseHTMLProps<'div'>, 'onChange'> {
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

const triggerPrefix = getPrefixCls('cascader-trigger')

export const CascaderTrigger = forwardRef<HTMLInputElement | null, CascaderTriggerProps>(
  ({ prefixCls = triggerPrefix, className, ...rest }, ref) => {
    const {
      disabled,
      placeholder,
      selectedItems,
      displayRender,
      clearable,
      value,
    } = useCascaderContext()

    const cls = cx(prefixCls, className)

    const showValue = useMemo(() => {
      if (displayRender) {
        return displayRender(selectedItems[selectedItems.length - 1], selectedItems)
      }

      return selectedItems.map((item) => item.title as string).join(', ')
    }, [displayRender, selectedItems])

    return (
      <Input
        ref={ref}
        className={cls}
        readOnly
        // TODO: 获取 value 对应的路径数据
        value={showValue}
        // onChange={tryChangeValue}
        disabled={disabled}
        clearable={clearable}
        placeholder={placeholder}
        suffix={<DownOutlined className={`${prefixCls}__suffix`} />}
        {...rest}
      />
    )
  }
)

export interface CascaderTriggerProps extends HiBaseHTMLProps<'input'> {}

if (__DEV__) {
  CascaderTrigger.displayName = 'CascaderTrigger'
}

const searchPrefix = getPrefixCls('cascader-search')

export const CascaderSearch = forwardRef<HTMLInputElement | null, CascaderSearchProps>(
  ({ prefixCls = searchPrefix, className, ...rest }, ref) => {
    const { isEmpty, emptyContent, getSearchInputProps } = useCascaderContext()

    return (
      <div ref={ref} className={cx(prefixCls, className)} {...rest}>
        <Input appearance="underline" prefix={<SearchOutlined />} {...getSearchInputProps()} />
        {isEmpty ? <span className={`${prefixCls}-search__empty`}>{emptyContent}</span> : null}
      </div>
    )
  }
)

export interface CascaderSearchProps extends HiBaseHTMLProps {}

if (__DEV__) {
  CascaderSearch.displayName = 'CascaderSearch'
}

const menuListPrefix = getPrefixCls('cascader-menu-list')

export const CascaderMenuList = forwardRef<HTMLDivElement | null, CascaderMenuListProps>(
  ({ prefixCls = menuListPrefix, className, ...rest }, ref) => {
    const { flatted, menuList, changeOnSelect } = useCascaderContext()

    const cls = cx(
      prefixCls,
      className,
      flatted && `${prefixCls}--flatted`,
      changeOnSelect && `${prefixCls}--selectchange`
    )

    return (
      <div ref={ref} className={cls} {...rest}>
        {menuList.map((menu, menuIndex) => {
          return isArrayNonEmpty(menu) ? <CascaderMenu key={menuIndex} data={menu} /> : null
        })}
      </div>
    )
  }
)

export interface CascaderMenuListProps extends HiBaseHTMLProps {}

if (__DEV__) {
  CascaderMenuList.displayName = 'CascaderMenuList'
}

const menuPrefix = 'cascader-menu'

export const CascaderMenu = ({
  prefixCls = menuPrefix,
  role = 'menu',
  className,
  data: menu,
}: CascaderMenuProps) => {
  const {
    flatted,
    disabled: disabledContext,
    expandTrigger,
    onItemClick,
    onItemHover,
    titleRender,
    onLoadChildren,
    getCascaderItemRequiredProps,
  } = useCascaderContext()

  const cls = cx(prefixCls, className)

  return (
    <ul className={cls} role={role}>
      {menu.map((option) => {
        const eventOption = getCascaderItemEventData(option, getCascaderItemRequiredProps(option))

        const { selected, loading } = eventOption
        const disabled = disabledContext || option.disabled

        const optionCls = cx(
          `${prefixCls}-option`,
          loading && `${prefixCls}-option--loading`,
          disabled && `${prefixCls}-option--disabled`,
          selected && `${prefixCls}-option--selected`
        )

        return (
          <li key={option.id} role="menu-item" className={`${prefixCls}-item`}>
            <div
              className={optionCls}
              onClick={() => {
                if (disabled) return
                onItemClick(eventOption)
              }}
              onMouseEnter={() => {
                if (disabled) return
                if (expandTrigger === 'hover') {
                  // TODO: onChange 不触发
                  onItemHover(eventOption)
                }
              }}
            >
              {flatted ? (
                renderFlattedTitle(eventOption, titleRender)
              ) : (
                <>
                  {renderDefaultTitle(eventOption, titleRender)}
                  {renderSuffix(prefixCls, option, loading, onLoadChildren)}
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export interface CascaderMenuProps extends HiBaseHTMLProps {
  /**
   * 设置选择项数据源
   */
  data: FlattedCascaderItem[]
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  item: FlattedCascaderItem,
  loading: boolean,
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const hasChildren = item.children && item.children.length > 0
  const canLoadChildren = hasChildren || (onLoadChildren && !item.children && !item.isLeaf)

  if (canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--arrow`)}>
        {defaultSuffixIcon}
      </span>
    )
  }

  return (
    <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--noop`)}>
      {defaultLeafIcon}
    </span>
  )
}

const renderFlattedTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, true) : true
  if (title !== true) return title

  return (
    <span className="title__text title__text--cols">
      {getNodeAncestors(option)
        .reverse()
        .map((item) => (
          <span key={item.id} className="title__text--col">
            {item.title}
          </span>
        ))}
    </span>
  )
}

const renderDefaultTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, false) : true
  if (title !== true) return title

  return <span className="title__text">{option.title}</span>
}

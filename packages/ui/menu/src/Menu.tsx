import React, {
  forwardRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import {
  HiBaseFieldNames,
  HiBaseHTMLProps,
  HiBaseSizeEnum,
  useLocaleContext,
  useGlobalContext,
} from '@hi-ui/core'
import Tooltip from '@hi-ui/tooltip'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { getTreeNodesWithChildren } from '@hi-ui/tree-utils'
import { isFunction, isArrayNonEmpty } from '@hi-ui/type-assertion'
import { useResizeObserver } from '@hi-ui/use-resize-observer'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { uuid } from '@hi-ui/use-id'
import { MenuDataItem, MenuFooterRenderProps } from './types'
import { MenuItem } from './MenuItem'
import MenuContext from './context'
import { getAncestorIds, transformTreeData } from './util'

const MENU_PREFIX = getPrefixCls('menu')

const DEFAULT_EXPANDED_IDS = [] as []
const NOOP_ARRAY = [] as []
const MIN_WIDTH = 56

const MENU_MORE_ID = `MENU_MORE_${uuid()}`

/**
 * 菜单
 */
export const Menu = forwardRef<HTMLDivElement | null, MenuProps>(
  (
    {
      prefixCls = MENU_PREFIX,
      role = 'menu',
      className,
      data = NOOP_ARRAY,
      fieldNames,
      placement = 'vertical',
      showCollapse = false,
      // 仅对垂直模式有效
      expandedType = 'collapse',
      showAllSubMenus = false,
      defaultExpandAll = false,
      defaultExpandedIds = DEFAULT_EXPANDED_IDS,
      expandedIds: expandedIdsProp,
      onExpand,
      defaultActiveId = '',
      activeId: activeIdProp,
      onClickSubMenu,
      collapsed,
      defaultCollapsed = false,
      overlayClassName,
      onCollapse,
      footerRender,
      render,
      extraHeader,
      onClick,
      size: sizeProp,
      showTitleOnMini = false,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const [activeId, updateActiveId] = useUncontrolledState(defaultActiveId, activeIdProp, onClick)

    const { size: globalSize } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'lg'
    if (size === 'xs') {
      size = 'sm'
    }

    const [activeParents, updateActiveParents] = useState(() => getAncestorIds(activeId, data))

    const transformedData = useMemo(() => {
      return transformTreeData(data, fieldNames)
    }, [data, fieldNames])

    useEffect(() => {
      updateActiveParents(getAncestorIds(activeId, transformedData))
    }, [activeId, transformedData])

    const [expandedIds, updateExpandedIds] = useUncontrolledState(
      () => {
        return defaultExpandAll
          ? getTreeNodesWithChildren(transformedData).map((node) => node.id)
          : defaultExpandedIds
      },
      expandedIdsProp,
      onExpand
    )

    const expandedIdsRef = useRef(expandedIds)

    const clickMenu = useCallback(
      (id: React.ReactText, raw: MenuDataItem) => {
        updateActiveId(id, raw)
      },
      [updateActiveId]
    )

    const clickSubMenu = useCallback(
      (id: React.ReactText) => {
        const nextExpandedIds = expandedIds.includes(id)
          ? expandedIds.filter((expandedId) => expandedId !== id)
          : expandedIds.concat(id)
        updateExpandedIds(nextExpandedIds)
        expandedIdsRef.current = nextExpandedIds
        if (onClickSubMenu) {
          onClickSubMenu(id, nextExpandedIds)
        }
      },
      [onClickSubMenu, expandedIds, updateExpandedIds]
    )

    const closePopper = useCallback(
      (id: React.ReactText) => {
        const nextExpandedIds = expandedIds.filter((expandedId) => expandedId !== id)
        updateExpandedIds(nextExpandedIds)
        expandedIdsRef.current = nextExpandedIds
      },
      [expandedIds, updateExpandedIds]
    )

    const closeAllPopper = useCallback(() => {
      updateExpandedIds([])
    }, [updateExpandedIds])

    const [mini, miniToggleAction] = useUncontrolledToggle({
      defaultVisible: defaultCollapsed,
      visible: collapsed,
      onToggle: onCollapse,
    })

    const showVertical = placement === 'vertical'
    const canToggle = showVertical && showCollapse
    const showMini = showVertical && mini

    const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
    const [containerWidth = 0, setContainerWidth] = useState<number>()

    useResizeObserver({
      element: containerElement,
      disabled: showVertical,
      getSize: (element) => {
        const itemRect = element.getBoundingClientRect()
        return itemRect.width
      },
      onResize: (el, width) => {
        setContainerWidth(width)
      },
    })

    useEffect(() => {
      if (mini) {
        updateExpandedIds([])
      } else {
        updateExpandedIds(expandedIdsRef.current)
      }
    }, [mini, updateExpandedIds])

    const [tagMaxCount, setTagMaxCount] = useState(0)

    const mergedTagList = useMemo(() => {
      if (showVertical) return transformedData
      if (containerWidth < MIN_WIDTH) return transformedData
      return transformedData.slice(0, Math.min(transformedData.length, containerWidth / MIN_WIDTH))
    }, [showVertical, transformedData, containerWidth])

    const restTagList = useMemo(() => {
      if (tagMaxCount > 0) return transformedData.slice(tagMaxCount)
      return []
    }, [transformedData, tagMaxCount])

    const getTagWidth = useCallback(
      (index: number) => {
        if (!containerElement) return MIN_WIDTH
        const elements = containerElement.getElementsByClassName('hi-v5-menu-item')
        const element = elements && elements[index]
        if (!element) return MIN_WIDTH
        return element.getBoundingClientRect().width
      },
      [containerElement]
    )

    useLayoutEffect(() => {
      if (showVertical) return

      let tagMaxCount = 0

      if (isArrayNonEmpty(mergedTagList)) {
        const len = mergedTagList.length
        const lastIndex = len - 1

        let totalWidth = 72 // 更多

        for (let i = 0; i < len; ++i) {
          const currentTagWidth = getTagWidth(i)

          if (currentTagWidth === undefined) {
            break
          }

          totalWidth += currentTagWidth

          if (
            (lastIndex === 0 && totalWidth <= containerWidth) ||
            (i === lastIndex - 1 && totalWidth + getTagWidth(lastIndex) <= containerWidth)
          ) {
            tagMaxCount = lastIndex
            break
          } else if (totalWidth > containerWidth) {
            tagMaxCount = i - 1
            break
          }
        }
      } else {
        tagMaxCount = 0
      }

      // 保底要展示 1 个
      setTagMaxCount(isArrayNonEmpty(mergedTagList) && tagMaxCount < 1 ? 1 : tagMaxCount + 1)
    }, [showVertical, getTagWidth, containerWidth, mergedTagList])

    const renderFooter = () => {
      const collapseNode = canToggle ? (
        <div className={cx(`${prefixCls}__toggle`)} onClick={() => miniToggleAction.not()}>
          {mini ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      ) : null

      return (
        <>
          {isFunction(footerRender)
            ? footerRender({ collapsed: showMini, collapseNode })
            : collapseNode}
        </>
      )
    }

    const renderItem = useCallback(
      (menuItem: MenuDataItem, level?: number) => {
        // 显示缩略内容
        if (showMini && level === 1 && !showTitleOnMini) {
          return renderMenuItemMini(menuItem)
        }

        return isFunction(render) ? render(menuItem, level) : menuItem.title
      },
      [render, showMini, showTitleOnMini]
    )

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${placement}`,
      `${prefixCls}--size-${size}`,
      mini && `${prefixCls}--mini`,
      showTitleOnMini && `${prefixCls}--show-title-on-mini`,
      (expandedType === 'pop' || showAllSubMenus || mini) && `${prefixCls}--popup`
    )

    return (
      <div ref={useMergeRefs(ref, setContainerElement)} role={role} className={cls} {...rest}>
        {extraHeader}

        <MenuContext.Provider
          value={{
            placement,
            expandedType,
            showAllSubMenus,
            mini,
            showTitleOnMini,
            clickMenu,
            clickSubMenu,
            closePopper,
            closeAllPopper,
            activeParents,
            activeId: activeId,
            expandedIds: expandedIds,
            overlayClassName,
          }}
        >
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {mergedTagList.map((item, index) => {
              return showMini ? (
                <Tooltip title={item.title} key={item.id} placement="right">
                  <MenuItem {...item} level={1} render={renderItem} raw={item} size={size} />
                </Tooltip>
              ) : (
                <MenuItem
                  hidden={!showVertical && index >= tagMaxCount}
                  {...item}
                  render={renderItem}
                  key={item.id}
                  level={1}
                  raw={item}
                  size={size}
                />
              )
            })}
            {showVertical || restTagList.length === 0 ? null : (
              <MenuItem
                key={MENU_MORE_ID}
                id={MENU_MORE_ID}
                title={i18n.tabs.more}
                children={restTagList}
              />
            )}
          </ul>

          <div className={`${prefixCls}__footer`}>{renderFooter()}</div>
        </MenuContext.Provider>
      </div>
    )
  }
)

export interface MenuProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'> {
  /**
   * 菜单项数据列表
   */
  data: MenuDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: HiBaseFieldNames
  /**
   * 默认激活的菜单项 id
   */
  defaultActiveId?: React.ReactText
  /**
   * 激活的菜单项 id
   */
  activeId?: React.ReactText
  /**
   * 设置菜单水平或垂直展示
   */
  placement?: 'horizontal' | 'vertical'
  /**
   * 是否收起子菜单，菜单垂直展示时有效
   */
  collapsed?: boolean
  /**
   * 默认是否收起子菜单，菜单垂直展示时有效
   */
  defaultCollapsed?: boolean
  /**
   * 是否显示收缩开关，菜单垂直展示时有效
   */
  showCollapse?: boolean
  /**
   * 是否以胖菜单的形式展开所有子菜单（仅在水平菜单时有效）
   */
  showAllSubMenus?: boolean
  /**
   * 手风琴模式，菜单水平展示时有效
   */
  accordion?: boolean
  /**
   * 下拉框根类名
   */
  overlayClassName?: string
  /**
   * 弹出层展开方式
   */
  expandedType?: 'collapse' | 'pop'
  /**
   * 首次渲染默认展开所有菜单项，为非受控模式
   */
  defaultExpandAll?: boolean
  /**
   * 首次渲染默认展开菜单项 ids 列表，为非受控模式
   */
  defaultExpandedIds?: React.ReactText[]
  /**
   * 展开菜单项 ids 列表，开启受控
   */
  expandedIds?: React.ReactText[]
  /**
   * 展开菜单时回调
   */
  onExpand?: (expandedIds: React.ReactText[]) => void
  /**
   * 点击菜单选项时的回调
   */
  onClick?: (menuId: React.ReactText, menuItem: MenuDataItem) => void
  /**
   * 点击父菜单项时的回调
   */
  onClickSubMenu?: (subMenuId: React.ReactText, expandedIds: React.ReactText[]) => void
  /**
   * 点击收缩开关时的回调
   */
  onCollapse?: (collapsed: boolean) => void
  /**
   * 底部渲染器
   */
  footerRender?: (props: MenuFooterRenderProps) => React.ReactNode
  /**
   * 自定义渲染菜单项
   */
  render?: (menuItem: MenuDataItem, level?: number) => React.ReactNode
  /**
   * 额外的头部内容
   */
  extraHeader?: React.ReactNode
  /**
   * 设置菜单项的尺寸
   */
  size?: Omit<HiBaseSizeEnum, 'xs'>
  /**
   * 是否在 mini 模式下显示菜单项的标题
   */
  showTitleOnMini?: boolean
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}

/**
 * Mini 模式下渲染 item
 */
const renderMenuItemMini = (menu: MenuDataItem) => {
  if (typeof menu.title === 'string') {
    return menu.title.substring(0, 1)
  }

  return menu.title
}

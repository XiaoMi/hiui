import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { HiBaseHTMLProps, useLocaleContext, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { __DEV__ } from '@hi-ui/env'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { SearchOutlined, CloseOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@hi-ui/icons'
import IconButton from '@hi-ui/icon-button'
import Button from '@hi-ui/button'
import Input from '@hi-ui/input'
import Highlighter from '@hi-ui/highlighter'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { MenuDataItem } from './types'
import { EnterIcon } from './EnterIcon'
import { searchMenuWithPath } from './util'

const _role = 'menu-search'
const _prefix = getPrefixCls(_role)

export const MenuSearch = forwardRef<HTMLDivElement | null, MenuSearchProps>(
  (
    {
      innerRef,
      prefixCls = _prefix,
      className,
      classNames: classNamesProp,
      styles: stylesProp,
      clearText,
      placeholder,
      notFoundContent,
      width,
      style,
      visible: visibleProp,
      data,
      defaultValue = '',
      value: valueProp,
      onChange,
      onSearch,
      onSelect,
      onClear,
      onClose,
      onEsc,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()
    const { menuSearch: menuSearchConfig } = useGlobalContext()
    const { classNames, styles } = useMergeSemantic<
      MenuSearchSemanticClassNames,
      MenuSearchSemanticStyles,
      MenuSearchProps
    >({
      classNamesList: [menuSearchConfig?.classNames, classNamesProp],
      stylesList: [menuSearchConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          data,
          placeholder,
          width,
          visible: visibleProp,
          defaultValue,
          value: valueProp,
        },
      },
    })

    const [visible, visibleAction] = useUncontrolledToggle({
      visible: visibleProp,
    })

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const [currentIndex, setCurrentIndex] = useState(-1)

    const listRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      if (currentIndex === -1 || !listRef.current) return

      const listContainer = listRef.current
      const selectedItem = listContainer.children[currentIndex] as HTMLElement

      if (!selectedItem) return

      const containerScrollTop = listContainer.scrollTop
      const containerHeight = listContainer.clientHeight
      const itemTop = selectedItem.offsetTop
      const itemHeight = selectedItem.offsetHeight

      // 计算元素的可见范围
      const itemBottom = itemTop + itemHeight
      const visibleTop = containerScrollTop
      const visibleBottom = containerScrollTop + containerHeight

      // 判断是否需要滚动
      const isItemAboveViewport = itemTop < visibleTop
      const isItemBelowViewport = itemBottom > visibleBottom

      if (isItemAboveViewport) {
        // 如果元素在可视区域上方，滚动到元素顶部
        listContainer.scrollTop = itemTop
      } else if (isItemBelowViewport) {
        // 如果元素在可视区域下方，滚动到元素底部刚好可见
        listContainer.scrollTop = itemBottom - containerHeight
      }
    }, [currentIndex])

    const resultMemo = React.useMemo(() => {
      if (!data || !value) return []

      // 使用新的搜索算法
      const searchResults = searchMenuWithPath(data, value)

      return searchResults.map((result) => ({
        ...result.node,
        level: result.level,
        path: result.path,
        // 添加路径信息用于显示
        pathTitles: result.path.map((p) => p.title?.toString()).filter(Boolean),
      }))
    }, [data, value])

    const handleChange = useCallback(
      (value: string) => {
        tryChangeValue(value)
      },
      [tryChangeValue]
    )

    const handleSelect = useCallback(
      (id: React.ReactText, item: MenuDataItem, index: number) => {
        setCurrentIndex(index)
        visibleAction.off()
        // 让列表容器获取焦点，确保键盘导航可用
        listRef.current?.focus()

        onSelect?.(id, item)
      },
      [onSelect, visibleAction]
    )

    const handleMove = useCallback(
      (direction: 'up' | 'down') => {
        if (!resultMemo) return

        setCurrentIndex((prev) => {
          if (direction === 'up') {
            return prev - 1 < 0 ? resultMemo?.length - 1 : prev - 1
          } else {
            return prev + 1 > resultMemo?.length - 1 ? 0 : prev + 1
          }
        })
      },
      [resultMemo]
    )

    const handleEnter = useCallback(() => {
      if (!resultMemo) return

      if (currentIndex === -1) {
        setCurrentIndex(0)
      }

      visibleAction.off()

      onSelect?.(resultMemo[currentIndex].id, resultMemo[currentIndex])
    }, [resultMemo, currentIndex, onSelect, visibleAction])

    const handleClear = useCallback(() => {
      tryChangeValue('')
      setCurrentIndex(-1)

      onClear?.()
    }, [onClear, tryChangeValue])

    const handleClose = useCallback(() => {
      visibleAction.off()
      onClose?.()
    }, [onClose, visibleAction])

    const handleEscape = useCallback(() => {
      handleClose()
      onEsc?.()
    }, [handleClose, onEsc])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
          handleMove('up')
        }

        if (e.key === 'ArrowDown') {
          handleMove('down')
        }

        if (e.key === 'Enter') {
          handleEnter()
        }

        if (e.key === 'Escape') {
          handleEscape()
        }
      },
      [handleEnter, handleMove, handleEscape]
    )

    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

    useEffect(() => {
      if (!value || !inputRef) {
        visibleAction.off()
      } else {
        visibleAction.on()
      }
    }, [inputRef, value, visibleAction])

    useImperativeHandle(innerRef, () => {
      return {
        show: () => {
          visibleAction.on()
        },
        hide: () => {
          visibleAction.off()
        },
        focus: () => {
          inputRef?.focus()
        },
      }
    })

    const cls = cx(prefixCls, className, classNames?.root, {
      [`${prefixCls}--open`]: visible,
    })

    return (
      <div className={cls} style={{ ...style, ...styles?.root }}>
        <MenuSearchInput
          width={width}
          prefixCls={prefixCls}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onClear={handleClear}
          onClose={handleClose}
          onKeyDown={handleKeyDown}
          inputRef={setInputRef}
          semanticClassNames={classNames}
          semanticStyles={styles}
        />
        <div
          className={cx(
            `${prefixCls}__content`,
            { [`${prefixCls}__content--visible`]: visible },
            classNames?.content
          )}
          style={styles?.content}
        >
          {resultMemo?.length > 0 ? (
            <>
              <div
                className={cx(`${prefixCls}__header`, classNames?.header)}
                style={styles?.header}
              >
                <Highlighter keyword={String(resultMemo?.length ?? 0)}>
                  {i18n.get('menuSearch.searchResult', {
                    count: resultMemo?.length ?? 0,
                    keyword: value,
                  })}
                </Highlighter>
              </div>
              <div
                className={cx(`${prefixCls}__list`, classNames?.list)}
                style={styles?.list}
                ref={listRef}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
              >
                {resultMemo?.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={cx(
                        `${prefixCls}__list-item`,
                        { [`${prefixCls}__list-item--selected`]: currentIndex === index },
                        classNames?.listItem
                      )}
                      style={styles?.listItem}
                      onClick={() => handleSelect(item.id, item, index)}
                    >
                      <div
                        className={cx(`${prefixCls}__list-item__title`, classNames?.listItemTitle)}
                        style={styles?.listItemTitle}
                      >
                        <EllipsisTooltip
                          tooltipProps={{
                            style: {
                              maxWidth: 320,
                            },
                          }}
                        >
                          {
                            (
                              <Highlighter keyword={value}>{item.pathTitles.join('/')}</Highlighter>
                            ) as any
                          }
                        </EllipsisTooltip>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className={cx(`${prefixCls}__empty`, classNames?.empty)} style={styles?.empty}>
              <div>{i18n.menuSearch.searchEmptyResult}</div>
            </div>
          )}
        </div>
        {resultMemo?.length > 0 && (
          <div className={cx(`${prefixCls}__footer`, classNames?.footer)} style={styles?.footer}>
            <div
              className={cx(`${prefixCls}__footer-item`, classNames?.footerItem)}
              style={styles?.footerItem}
            >
              <div
                className={cx(`${prefixCls}__footer-item__icon`, classNames?.footerItemIcon)}
                style={styles?.footerItemIcon}
              >
                <ArrowUpOutlined />
                <ArrowDownOutlined />
              </div>
              <span
                className={cx(`${prefixCls}__footer-item__text`, classNames?.footerItemText)}
                style={styles?.footerItemText}
              >
                {i18n.menuSearch.moveCursor}
              </span>
            </div>
            <div
              className={cx(`${prefixCls}__footer-item`, classNames?.footerItem)}
              style={styles?.footerItem}
            >
              <div
                className={cx(`${prefixCls}__footer-item__icon`, classNames?.footerItemIcon)}
                style={styles?.footerItemIcon}
              >
                <EnterIcon />
              </div>
              <span
                className={cx(`${prefixCls}__footer-item__text`, classNames?.footerItemText)}
                style={styles?.footerItemText}
              >
                {i18n.menuSearch.confirmSelect}
              </span>
            </div>
            <div
              className={cx(`${prefixCls}__footer-item`, classNames?.footerItem)}
              style={styles?.footerItem}
            >
              <div
                className={cx(`${prefixCls}__footer-item__icon`, classNames?.footerItemIcon)}
                style={styles?.footerItemIcon}
              >
                esc
              </div>
              <span
                className={cx(`${prefixCls}__footer-item__text`, classNames?.footerItemText)}
                style={styles?.footerItemText}
              >
                {i18n.menuSearch.hideWindow}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
)

if (__DEV__) {
  MenuSearch.displayName = 'MenuSearch'
}

export interface MenuSearchHelper {
  show: () => void
  hide: () => void
  focus: () => void
}

export type MenuSearchSemanticName =
  | 'root'
  | 'inputWrapper'
  | 'input'
  | 'inputClear'
  | 'close'
  | 'content'
  | 'header'
  | 'list'
  | 'listItem'
  | 'listItemTitle'
  | 'empty'
  | 'footer'
  | 'footerItem'
  | 'footerItemIcon'
  | 'footerItemText'
export type MenuSearchSemanticClassNames = SemanticClassNamesType<
  MenuSearchProps,
  MenuSearchSemanticName
>
export type MenuSearchSemanticStyles = SemanticStylesType<MenuSearchProps, MenuSearchSemanticName>
export type MenuSearchSemantic = ComponentSemantic<
  MenuSearchSemanticClassNames,
  MenuSearchSemanticStyles
>
export interface MenuSearchProps extends HiBaseHTMLProps<'div'>, MenuSearchSemantic {
  innerRef?: React.RefObject<MenuSearchHelper>
  clearText?: React.ReactNode
  placeholder?: string
  notFoundContent?: React.ReactNode
  width?: React.CSSProperties['width']
  visible?: boolean
  data?: MenuDataItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onSelect?: (id: React.ReactText, item: MenuDataItem) => void
  onClear?: () => void
  onClose?: () => void
  onEsc?: () => void
}

export const MenuSearchInput = forwardRef<
  HTMLInputElement,
  {
    prefixCls: string
    placeholder?: string
    inputRef?: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>
    width?: React.CSSProperties['width']
    value?: string
    onChange?: (value: string) => void
    onClear?: () => void
    onClose?: () => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    semanticClassNames?: Record<string, string | undefined>
    semanticStyles?: Record<string, React.CSSProperties | undefined>
  }
>(
  (
    {
      prefixCls,
      placeholder,
      width,
      value,
      onChange,
      onClear,
      onClose,
      onKeyDown,
      inputRef,
      semanticClassNames,
      semanticStyles,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    return (
      <div
        ref={ref}
        className={cx(`${prefixCls}__input-wrapper`, semanticClassNames?.inputWrapper)}
        style={{ width, ...semanticStyles?.inputWrapper }}
      >
        <Input
          ref={inputRef}
          className={cx(`${prefixCls}__input`, semanticClassNames?.input)}
          style={semanticStyles?.input}
          classNames={{
            prefix: `${prefixCls}__input-prefix`,
          }}
          appearance="unset"
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          suffix={
            <Button
              className={cx(`${prefixCls}__input-clear`, semanticClassNames?.inputClear)}
              style={semanticStyles?.inputClear}
              appearance="link"
              size="xs"
              onClick={onClear}
            >
              {i18n.menuSearch.clear}
            </Button>
          }
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          {...rest}
        />
        <span
          className={cx(`${prefixCls}__close`, semanticClassNames?.close)}
          style={semanticStyles?.close}
        >
          <IconButton icon={<CloseOutlined />} effect onClick={onClose} />
        </span>
      </div>
    )
  }
)

if (__DEV__) {
  MenuSearchInput.displayName = 'MenuSearchInput'
}

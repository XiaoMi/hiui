import React, { Fragment } from 'react'
import { cx } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Popper, { PopperProps } from '@hi-ui/popper'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { Highlighter } from '@hi-ui/highlighter'
import { useLatestCallback } from '@hi-ui/use-latest'
import Loading from '@hi-ui/loading'
import { SearchDataItem } from './types'
import { SearchProps } from './Search'

const NOOP_ARRAY = [] as []

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  prefixCls,
  data = NOOP_ARRAY,
  loading,
  focusIndex,
  subFocusIndex,
  onSelect,
  keyword,
  popper,
}) => {
  const highlightKeyword = useLatestCallback((title: string) => {
    if (keyword && keyword.length > 0) {
      return <Highlighter keyword={keyword}>{title}</Highlighter>
    }

    return title
  })

  return (
    <Popper {...popper}>
      <Loading visible={loading}>
        <div className={`${prefixCls}__dropdown`}>
          {data.map((item, index) => {
            const isGroup = !!item.children && item.children.length > 0

            return (
              <Fragment key={item.id}>
                <div
                  className={cx(
                    `${prefixCls}__dropdown-item`,
                    isGroup && `${prefixCls}__dropdown-group`,
                    focusIndex === index && !isGroup && `${prefixCls}__dropdown-item--focus`
                  )}
                  onClick={() => {
                    if (!isGroup) {
                      onSelect(item)
                    }
                  }}
                >
                  {/* groupTitle 不参与高亮检索 */}
                  {isGroup ? item.title : highlightKeyword(item.title as string)}
                </div>
                {isArrayNonEmpty(item.children)
                  ? item.children.map((subItem, idx) => (
                      <div
                        key={subItem.id}
                        className={cx(
                          `${prefixCls}__dropdown-subitem`,
                          subFocusIndex === idx &&
                            focusIndex === index &&
                            `${prefixCls}__dropdown-subitem--focus`
                        )}
                        onClick={() => {
                          onSelect(subItem)
                        }}
                      >
                        {highlightKeyword(subItem.title as string)}
                      </div>
                    ))
                  : null}
              </Fragment>
            )
          })}
        </div>
      </Loading>
    </Popper>
  )
}

export interface SearchDropdownProps extends Pick<SearchProps, 'prefixCls' | 'loading'> {
  /**
   * 下拉选项
   */
  data?: SearchDataItem[]
  /**
   * 下拉 popper 透传的 props
   */
  popper: PopperProps
  /**
   * 聚焦选项数组索引
   */
  focusIndex: number | null
  /**
   * 聚焦子选项数组索引
   */
  subFocusIndex: number | null
  /**
   * 点击选中时回调
   */
  onSelect: (item: SearchDataItem) => void
  /**
   * 搜索关键词
   */
  keyword: string
}

if (__DEV__) {
  SearchDropdown.displayName = 'SearchDropdown'
}

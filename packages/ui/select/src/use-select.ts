import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { SelectProps } from './Select'
import { useSearch } from './hooks'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { cx } from '@hi-ui/classname'
import { SelectDataItem, SelectGroupDataItem, SelectItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { toArray } from '@hi-ui/use-children'
import { flattenTree } from '@hi-ui/tree-utils'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = ''

export const useSelect = ({
  data: dataProp = NOOP_ARRAY,
  children,
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect,
  emptyContent = '无匹配选项',
  searchPlaceholder,
  ...rest
}: UseSelectProps) => {
  const data = useMemo(() => {
    let selectData = dataProp
    if (children) {
      const dfs = (children: any) => {
        const arr: any[] = []
        const list = toArray(children)

        list.forEach((item) => {
          if (!React.isValidElement(item)) return

          // @ts-ignore
          if (item.type && item.type.HiName === 'SelectOption') {
            const { props } = item as any
            const { value, children, disabled, groupTitle, ...rest } = props
            const option = {
              id: value,
              title: children,
              disabled: disabled,
              rootProps: rest,
            } as SelectDataItem
            arr.push(option)

            // @ts-ignore
          } else if (item.type && item.type.HiName === 'SelectOptionGroup') {
            const { props } = item as any
            const { groupId, label, children, ...rest } = props

            const optGroup: SelectGroupDataItem = {
              groupId: groupId,
              groupTitle: label,
              children: [] as SelectDataItem[],
              // @ts-ignore
              rootProps: rest,
            }

            // @ts-ignore
            if (children) {
              // @ts-ignore
              optGroup.children = dfs(children)
            }

            arr.push(optGroup)
          }
        })

        return arr
      }

      selectData = dfs(children)
    }

    return selectData
  }, [children, dataProp])

  const flattedData = useMemo(() => {
    // @ts-ignore
    return flattenTree(data, (node) => {
      if ('groupId' in node.raw) {
        // @ts-ignore
        node.id = node.raw.groupId
        // @ts-ignore
        node.groupTitle = node.raw.groupTitle
        // @ts-ignore
        node.groupId = node.raw.groupId
      } else {
        node.id = node.raw.id
        // @ts-ignore
        node.title = node.raw.title
      }
      return node
    })
  }, [data])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const proxyTryChangeValue = useCallback(
    (value: React.ReactText, item: SelectItem) => {
      tryChangeValue(value, item)
      onSelectLatest(value, item)
    },
    [tryChangeValue, onSelectLatest]
  )

  const [onOptionClick, isSelectedId] = useSelectDefault({
    disabled,
    selectedId: value,
    onSelect: proxyTryChangeValue,
    allowSelect,
  })

  const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(data)

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  const getOptionProps = useCallback(
    (props, ref) => {
      const { value: id, className, disabled = false, children, prefixCls, ...rest } = props
      const cls = cx(prefixCls, className, isSelectedId(id) && `${prefixCls}--selected`)

      return {
        ...rest,
        ref,
        className: cls,
        onClick: () => {
          onOptionClick({ id, disabled, title: children })
        },
      }
    },
    [onOptionClick, isSelectedId]
  )

  const rootProps = rest

  return {
    rootProps,
    data: inSearch ? matchedItems : data,
    flattedData,
    value,
    onSelect: onOptionClick,
    isSelectedId,
    emptyContent,
    getSearchInputProps,
    getOptionProps,
    tryChangeValue,
    isEmpty,
    resetSearch,
  }
}

export interface UseSelectProps extends SelectProps {}

export type UseSelectReturn = ReturnType<typeof useSelect>

const allowSelect = (option: any) => !option.disabled

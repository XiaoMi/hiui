import React from 'react'
import { useRequest } from 'ahooks'
import { Checkbox } from '@hi-ui/checkbox'
import { Button } from '@hi-ui/button'
import { Input } from '@hi-ui/input'
import { Loading } from '@hi-ui/loading'
import { SearchOutlined } from '@hi-ui/icons'
import type { SelectDataItem } from '@hi-ui/select'
import { Empty } from '../../empty'
import type { CommonFilterProps } from '../type'
import { cls } from '../utils'

export type SelectFilterOptions =
  | SelectDataItem[]
  | {
      (keyword?: string): Promise<SelectDataItem[]>
      syncOpts?: false
    }
  | {
      (): SelectDataItem[]
      syncOpts: true
    }

export type BuiltinSelectFilterProps = CommonFilterProps & {
  options: SelectFilterOptions
  showCheckAll?: boolean
}

export function SelectFilter(props: BuiltinSelectFilterProps) {
  const { value = [], onChange } = props
  const [localValue, setLocalValue] = React.useState(value)
  const [searchKey, setSearchKey] = React.useState('')

  const {
    data: options = [],
    loading,
    runAsync,
    cancel: cancelRequest,
  } = useOptions(props.options, searchKey)

  const handleSearchChange = (keyword: string) => {
    setSearchKey(keyword)
    runAsync(keyword)
  }

  const handleOptionChange = (optionId: string | number) => {
    setLocalValue((prev) => {
      const index = prev.indexOf(optionId)
      if (index > -1) {
        return prev.filter((id) => id !== optionId)
      }
      return [...prev, optionId]
    })
  }

  const handleCheckAll = (checked: boolean) => {
    setLocalValue(checked ? options.map((opt) => opt.id) : [])
  }

  const handleConfirm = () => {
    onChange(localValue.length > 0 ? localValue : undefined)
    props.onClose?.()
    cancelRequest()
  }

  const handleReset = () => {
    setLocalValue([])
    onChange()
    props.onClose?.()
    cancelRequest()
  }

  const allChecked = options.length > 0 && options.every((opt) => localValue.includes(opt.id))
  const indeterminate = options.some((opt) => localValue.includes(opt.id)) && !allChecked

  return (
    <div className={cls('container')} data-filter-type="select">
      <div className={cls('search')}>
        <Input
          appearance="underline"
          prefix={<SearchOutlined />}
          value={searchKey}
          onChange={(_, keyword) => handleSearchChange(keyword)}
          placeholder="搜索"
          clearable
        />
      </div>

      <Loading visible={loading}>
        <div className={cls('content')}>
          {options.map((option) => (
            <div key={option.id} className={cls('option')}>
              <Checkbox
                checked={localValue.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              >
                {option.title}
              </Checkbox>
            </div>
          ))}

          {options.length === 0 ? <Empty size="lg" /> : null}
        </div>
      </Loading>

      <div className={cls('footer')}>
        <div className={cls('footer-left')}>
          {props.showCheckAll ? (
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={(e) => handleCheckAll(e.target.checked)}
              style={{ fontSize: 12, userSelect: 'none' }}
            >
              全选
            </Checkbox>
          ) : null}
        </div>

        <div className={cls('footer-right')}>
          <Button size="sm" onClick={handleReset}>
            重置
          </Button>
          <Button size="sm" type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

function useOptions(options: SelectFilterOptions, keyword?: string) {
  const asyncOptions = useRequest(
    (keyword?: string) => {
      if (typeof options !== 'function') return Promise.resolve([])
      if (options.syncOpts) return Promise.resolve([])
      return options(keyword)
    },
    { debounceWait: 300 }
  )

  if (typeof options === 'function' && !options.syncOpts) return asyncOptions
  else {
    const opts = typeof options === 'function' ? options() : options

    const filteredOptions = keyword
      ? opts.filter((opt) => {
          return opt.title
            ?.toString()
            .toLowerCase()
            .includes(keyword?.toLowerCase() || '')
        })
      : opts

    return {
      data: filteredOptions,
      loading: false,
      runAsync: () => {
        // empty placeholder
      },
      cancel: () => {
        // empty placeholder
      },
    }
  }
}

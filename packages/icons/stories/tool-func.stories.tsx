import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { IconSummation, IconProps } from '../src'
import { Select } from '@hi-ui/select'
import { SelectDataItem } from '@hi-ui/select/lib/types/types'

export const ToolFunc = () => {
  const [selectedIcon, setSelectedIcon] = useState('')

  /**
   * 首字母大写驼峰转中划线
   * @param hump 驼峰命名字符串(EM: ApproveFilled)
   */
  const transformHumpToStrike = (hump: string) => {
    const preDisposed = hump[0].toLowerCase() + hump.slice(1)
    return preDisposed.replace(/[A-Z]/g, function (match) {
      return '-' + match.toLowerCase()
    })
  }

  /**
   * 获取 Icons 组件所有 Icon 以及其描述信息
   */
  const getAllIcons = () => {
    const keys = Object.keys(IconSummation).sort((a, b) => (a > b ? 1 : -1))
    return keys.map((item) => ({
      component: IconSummation[item as keyof typeof IconSummation] as FunctionComponent<IconProps>,
      tagName: item,
      strike: transformHumpToStrike(item),
    }))
  }

  /**
   * 从标签名获取 icon 组件
   * @param tagName 首字母大写驼峰命名(EM: ApproveFilled)
   */
  const getComponentFromTagName = (tagName: string) =>
    IconSummation[tagName as keyof typeof IconSummation]

  /**
   * 中划线命名转换为首字母大写驼峰命名
   * @param strike 中划线命名(EM: approve-filled)
   */
  const transformStrikeToHump = (strike: string) => {
    const preDisposed = strike[0].toUpperCase() + strike.slice(1)
    return preDisposed.replace(/-\D/g, function (match) {
      return match.charAt(1).toUpperCase()
    })
  }

  const IconSelectData: SelectDataItem[] = useMemo(() => {
    return getAllIcons().map((item) => ({
      id: item.strike,
      title: item.strike,
      component: item.component,
    }))
  }, [])

  const iconSelectRender = useCallback((item: SelectDataItem) => {
    const MatchIconComponent = (item as any).raw.component
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MatchIconComponent style={{ fontSize: '18px', color: '#237ffa', marginRight: '12px' }} />
        <span>{item.title}</span>
      </div>
    )
  }, [])

  const SelectedIconComponent = useMemo(
    () => (selectedIcon ? getComponentFromTagName(transformStrikeToHump(selectedIcon)) : undefined),
    [selectedIcon]
  )

  return (
    <>
      <h1>Tool func template</h1>
      <div className="tool-func-basic__wrap">
        <h2>getAllIcons</h2>
        <Select
          searchable
          data={IconSelectData}
          render={iconSelectRender}
          displayRender={iconSelectRender}
          clearable={false}
          value={selectedIcon}
          onChange={(e) => setSelectedIcon(e as string)}
        />
        <h2>getComponentFromTagName</h2>
        <div>Selected icon</div>
        <div style={{ fontSize: '36px' }}>{SelectedIconComponent && <SelectedIconComponent />}</div>
      </div>
    </>
  )
}

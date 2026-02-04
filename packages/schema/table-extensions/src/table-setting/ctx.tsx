import React from 'react'
import { produce } from 'immer'
import { useMount } from 'ahooks'
import { mergeValues } from '@hi-ui/schema-utils'
import type { ColumnSetting } from './type'
import type { TableColumnSettings, TableSettingProps, TableSettingChangeResult } from './index'

interface SettingContextValue {
  // 状态
  settings: TableColumnSettings
  searchKey: string

  // 方法
  setSearchKey: (key: string) => void
  updateSetting: (columnId: string, partial: Partial<ColumnSetting>) => void
  moveColumn: (fromId: string, toId: string) => void
  resetSettings: () => void
  applySettings: () => void
}

export const SettingContext = React.createContext<SettingContextValue>(
  null as unknown as SettingContextValue
)

export function SettingProvider(props: React.PropsWithChildren<TableSettingProps>) {
  const { columns, onChange, storageKey } = props

  // 使用 ref 存储初始状态
  const initialSettings = React.useRef<TableColumnSettings>()

  // 状态管理
  const [settings, setSettings] = React.useState(() => {
    // 计算初始状态
    const initial = (function getInitialSettings(): TableColumnSettings {
      // 1. 首先根据 columns 计算默认值
      const defaultSettings = columns.reduce((acc, col, index) => {
        acc[col.id] = {
          // hidden 为 true 时，visible 为 false
          visible: col.hidden !== true,
          fixed: col.fixed || false,
          order: index,
        }
        return acc
      }, {} as TableColumnSettings)

      // 2. 如果没有 storageKey 直接返回默认值
      if (!storageKey) return defaultSettings

      // 3. 尝试读取缓存
      try {
        const cached = localStorage.getItem(storageKey)
        if (!cached) return defaultSettings
        const cachedSettings = JSON.parse(cached) as TableColumnSettings

        // 4. 合并缓存和默认值
        return mergeValues(defaultSettings, cachedSettings)
      } catch (err) {
        console.warn('Failed to parse stored table settings:', err)
        return defaultSettings
      }
    })()

    // 将初始状态保存到 ref 中
    initialSettings.current = initial
    return initial
  })

  const [searchKey, setSearchKey] = React.useState('')

  // 更新方法
  const updateSetting = React.useCallback((columnId: string, partial: Partial<ColumnSetting>) => {
    setSettings(
      produce((draft: TableColumnSettings) => {
        if (!draft[columnId]) {
          draft[columnId] = { visible: true, fixed: false, order: 0 }
        }
        Object.assign(draft[columnId], partial)
      })
    )
  }, [])

  // 拖拽排序
  const moveColumn = React.useCallback((fromId: string, toId: string) => {
    setSettings(
      produce((draft: TableColumnSettings) => {
        const fromOrder = draft[fromId]?.order ?? 0
        const toOrder = draft[toId]?.order ?? 0

        // 更新所有受影响的列的order
        Object.keys(draft).forEach((id) => {
          const setting = draft[id]
          if (!setting) return

          if (fromOrder < toOrder) {
            // 向下拖动
            if (setting.order > fromOrder && setting.order <= toOrder) {
              setting.order--
            }
          } else {
            // 向上拖动
            if (setting.order >= toOrder && setting.order < fromOrder) {
              setting.order++
            }
          }
        })

        // 设置拖动项的新order
        draft[fromId] = draft[fromId] || { visible: true, fixed: false, order: 0 }
        draft[fromId].order = toOrder
      })
    )
  }, [])

  // 重置
  const resetSettings = React.useCallback(() => {
    // 恢复到 ref 中存储的初始状态
    if (initialSettings.current) {
      setSearchKey('')
      setSettings(initialSettings.current)
    }
  }, [])

  // 应用
  const applySettings = React.useCallback(() => {
    const result = Object.entries(settings)
      .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
      .reduce<TableSettingChangeResult>(
        (acc, [key, value]) => {
          acc.keys.push(key) // 收集排序后的 key
          acc.settings[key] = value // 构建排序后的设置
          acc.grouped.visibility[key] = value.visible // 构建 visibility
          // 收集 fixed 列
          if (value.fixed === 'left') acc.grouped.fixed.left.push(key)
          else if (value.fixed === 'right') acc.grouped.fixed.right.push(key)

          return acc
        },
        {
          keys: [],
          settings: {},
          grouped: { visibility: {}, fixed: { left: [], right: [] } },
        }
      )

    onChange?.(result)
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(result.settings))
    }
  }, [settings, onChange, storageKey])

  // 挂载时直接触发一次应用
  useMount(() => applySettings())

  return (
    <SettingContext.Provider
      value={{
        settings,
        searchKey,
        setSearchKey,
        updateSetting,
        moveColumn,
        resetSettings,
        applySettings,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  )
}

export function useSetting() {
  const context = React.useContext(SettingContext)
  if (!context) {
    throw new Error('useSetting must be used within SettingProvider')
  }
  return context
}

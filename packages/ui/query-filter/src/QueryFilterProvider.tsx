import React from 'react'
import { FilterProvider } from './context'

export const QueryFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 缓存选中的数据，方便在多个组件中共享数据，解决组件 dataSource 模式下选中数据回显问题
  const [selectedCacheData, setSelectedCacheData] = React.useState<Map<string, any[]>>(new Map())

  return (
    <FilterProvider value={{ selectedCacheData, setSelectedCacheData }}>{children}</FilterProvider>
  )
}

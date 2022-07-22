import React from 'react'
import { TabList } from '../src'

/**
 * @title 单独使用 TabList
 */
export const TabsList = () => {
  return (
    <>
      <h1>单独使用 TabList</h1>
      <div className="tabs-basic__wrap">
        <TabList
          data={[
            { tabId: '0', tabTitle: '角色' },
            { tabId: '1', tabTitle: '数据' },
          ]}
        />
      </div>
    </>
  )
}

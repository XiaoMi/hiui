import React from 'react'

export interface BaseTreeNodeData {
  id: React.ReactText
  children?: BaseTreeNodeData[]
}

export interface BaseFlattedTreeNodeDataWithParent<T = any> {
  parent?: T
}

// TODO: ts 类型工具函数 将指定属性转为非可选属性
export interface BaseFlattedTreeNodeDataWithChildren<T extends BaseFlattedTreeNodeData<any>>
  extends BaseFlattedTreeNodeData<any> {
  children: T[]
}

export interface BaseFlattedTreeNodeData<T extends BaseFlattedTreeNodeData<T, any>, R = any> {
  id: React.ReactText
  parent?: BaseFlattedTreeNodeDataWithChildren<T>
  children?: T[]
  depth: number
  raw: R
}

export interface NodeRoot<T> {
  depth: number
  children: T[]
}

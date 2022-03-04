import React from 'react'
import Result from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="result-basic__wrap">
        <Result type="info" title="操作成功"></Result>
        <Result type="success" title="操作成功"></Result>
        <Result type="warn" title="操作成功"></Result>
        <Result type="error" title="操作成功"></Result>
        <Result type="error" iconSize="sm" title="操作成功"></Result>
        <Result type="error" title="操作成功"></Result>
        <Result type="error" iconSize="lg" title="操作成功"></Result>
        <Result type="no-permission" iconSize="sm" title="操作成功"></Result>
        <Result type="no-permission" iconSize="md" title="操作成功"></Result>
        <Result type="no-permission" iconSize="lg" title="操作成功"></Result>
        <Result type="operation-succeed" iconSize="sm" title="操作成功"></Result>
        <Result type="operation-succeed" iconSize="md" title="操作成功"></Result>
        <Result type="operation-succeed" iconSize="lg" title="操作成功"></Result>
      </div>
    </>
  )
}

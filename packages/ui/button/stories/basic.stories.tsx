import React from 'react'
import Button from '../src'

/**
 * @title 基础用法
 * @desc 主要按钮：主操作按钮，对用户有强烈的引导作用\n普通按钮：次级操作按钮，表示一般性动作，不具备较强的引导性\n安全按钮：与危险按钮搭配使用，属于安全操作按钮\n危险按钮：用于警示用户操作可能带来风险，可单独使用或与安全按钮搭配使用\n幽灵按钮：常用在设置属性、调整参数等场景，常与深色背景搭配
 */
export const Basic = () => {
  return (
    <>
      <h1>不同类型</h1>
      <div className="button-basic__wrap">
        <Button type="primary">主要按钮</Button>
        <Button type="secondary">次要按钮</Button>
        <Button type="default">中性按钮</Button>
        <Button type="danger">危险按钮</Button>
        <Button type="success">成功按钮</Button>
      </div>
    </>
  )
}

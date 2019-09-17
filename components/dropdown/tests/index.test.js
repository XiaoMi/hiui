import React from 'react'
import { mount } from 'enzyme'
import Dropdown from '../'
import Icon from '../../icon'

let wrapper
const clickCallback = jest.fn(val => val)
const list = [{
  title: '电视'
}, {
  title: '手机'
}, {
  title: '电脑'
}]
const listIcons = [{
  title: 'one'
}, {
  title: 'two',
  prefix: <Icon name='add'/> // 此 prefix 将会被替换为外部的 prefix
}, {
  title: 'three',
  suffix: <Icon name='truck'/>
}]

describe('Dropdown', () => {
  beforeEach(() => {})

  afterEach(() => {
    wrapper && wrapper.unmount()
    clickCallback.mockClear()
  })

  it('基础用法', () => {
    wrapper = mount(
      <Dropdown list={list} title="电子产品" onClick={clickCallback}/>
    )

    wrapper.find('.hi-dropdown').getDOMNode().click() // 展开
    expect(document.querySelectorAll('.hi-dropdown__item')).toHaveLength(3)

    document.querySelectorAll('.hi-dropdown__item')[2].click() // 测试click选项
    expect(clickCallback.mock.results[0].value).toBe('电脑')
  })

  it('按钮菜单', () => {
    wrapper = mount(
      <Dropdown
        list={listIcons}
        title="按钮菜单"
        type="button"
        onClick={clickCallback}
        prefix={<Icon name='list'/>}
      />
    )
    wrapper.find('.hi-dropdown').getDOMNode().click() // 展开
    expect(document.querySelectorAll('.hi-dropdown__item')).toHaveLength(3)

    expect(document.querySelectorAll('.hi-dropdown__item')[2].querySelectorAll('.hi-dropdown__item-prefix .icon-list')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-dropdown__item')[2].querySelectorAll('.hi-dropdown__item-suffix .icon-truck')).toHaveLength(1)

    document.querySelectorAll('.hi-dropdown__item')[2].click() // 测试click选项
    expect(clickCallback.mock.results[0].value).toBe('three')
  })
})

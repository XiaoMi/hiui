import React from 'react'
import { mount } from 'enzyme'
import NavMenu from '../'

let wrapper
const clickCallback = jest.fn(items => items)
const options = [
  {title: 'Option 0'},
  {title: 'Option 1', disabled: true},
  {title: 'Option 2'},
  {title: 'Option 3'},
  {title: 'Option 4'}
]

describe('NavMenu', () => {
  afterEach(() => {
    wrapper && wrapper.unmount()
    clickCallback.mockClear()
  })

  it('基础用法', () => {
    wrapper = mount(
      <NavMenu
        onClick={clickCallback}
        data={options}
        selectedKey={2}
      >
        <div>0</div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </NavMenu>
    )
    // 默认激活项
    expect(wrapper.find('.hi-navmenu__item').at(2).hasClass('on')).toBeTruthy()
    expect(wrapper.find('.hi-navmenu__content-item--show').text()).toEqual('2')

    // 禁止项不可点
    wrapper.find('.hi-navmenu__content-item').at(1).simulate('click')
    expect(clickCallback).toHaveBeenCalledTimes(0)

    // 选中第一项
    wrapper.find('.hi-navmenu__item').at(0).simulate('click')
    expect(clickCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.hi-navmenu__item').at(0).hasClass('on')).toBeTruthy()
    expect(wrapper.find('.hi-navmenu__content-item--show').text()).toEqual('0')
  })

  it('自定义渲染', () => {
    const datas = [
      {title: 'Option 0'},
      {title: '点我跳转', url: 'https://www.mi.com/'},
      {title: 'Option 2', icon: 'https://www.mi.com/favicon.ico'},
      {title: 'Option 3'},
      {title: 'Option 4'}
    ]
    wrapper = mount(
      <NavMenu
        onClick={clickCallback}
        selectedKey={2}
        data={datas}
        render={data => {
          return data.icon ? <span><img src={data.icon}/>{data.title}</span> : data.url ? <a href={data.url}>{data.title}</a> : data.title
        }}
      ></NavMenu>
    )

    expect(wrapper.find('.hi-navmenu__item').find('img').props().src).toEqual('https://www.mi.com/favicon.ico')
    expect(wrapper.find('.hi-navmenu__item').find('a').props().href).toEqual('https://www.mi.com/')

    // 选中第3项
    wrapper.find('.hi-navmenu__item').at(2).simulate('click')
    expect(clickCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.hi-navmenu__item').at(2).hasClass('on')).toBeTruthy()
  })

  it('二级菜单', () => {
    const datas = [
      {
        title: 'Option 0',
        children: [
          {title: 'Option 6'},
          {title: 'Option 6'}
        ]
      },
      {
        title: 'Option 1',
        disabled: true,
        children: [
          {title: 'Option 6'},
          {title: 'Option 6'}
        ]
      },
      {
        title: 'Option 2',
        children: [
          {title: 'Option 7'},
          {title: 'Option 7'}
        ]
      },
      {
        title: 'Option 3',
        children: [
          {title: 'Option 8'},
          {title: 'Option 8'}
        ]
      },
      {
        title: 'Option 4',
        children: [
          {title: 'Option 9'},
          {title: 'Option 9'}
        ]
      }
    ]
    wrapper = mount(
      <NavMenu
        onClick={clickCallback}
        data={datas}
      ></NavMenu>
    )

    expect(wrapper.find('.hi-navmenu__sublist').find('.hi-navmenu__sub')).toHaveLength(2)
    expect(wrapper.find('.hi-navmenu__sublist').find('.hi-navmenu__sub .on')).toHaveLength(0)
    wrapper.find('.hi-navmenu__sublist').find('.hi-navmenu__sub').at(1).simulate('click')
    expect(wrapper.find('.hi-navmenu__sublist').find('.hi-navmenu__sub').at(1).hasClass('on')).toBeTruthy()
  })
})

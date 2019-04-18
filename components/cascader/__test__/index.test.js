import React from 'react'
import { mount } from 'enzyme'
import Cascader from '../'

let wrapper
const changeCallback = jest.fn(value => value)
const activeItemChangeCallback = jest.fn(value => value)
jest.mock('lodash/debounce', () => jest.fn(fn => fn))
const options = [
  {
    value: '手机',
    label: '手机',
    children: [
      {
        value: '小米',
        label: '小米',
        children: [
          {
            value: '小米3',
            label: '小米3'
          },
          {
            value: '小米4',
            label: '小米4'
          }
        ]
      },
      {
        value: '红米',
        label: '红米',
        children: [
          {
            value: '红米3',
            label: '红米3',
            disabled: true
          },
          {
            value: '红米4',
            label: '红米4'
          }
        ]
      }
    ]
  },
  {
    value: '电视',
    label: '电视',
    children: [
      {
        value: '小米电视4A',
        label: '小米电视4A'
      },
      {
        value: '小米电视4C',
        label: '小米电视4C'
      }
    ]
  }
]

describe('Cascader', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setTimeout(10000)
  })

  afterEach(() => {
    wrapper && wrapper.unmount()
    changeCallback.mockClear()
    activeItemChangeCallback.mockClear()
    jest.useRealTimers()
  })

  it('禁用', () => {
    wrapper = mount(
      <Cascader
        onChange={changeCallback}
        disabled={true}
        options={options}
        style={{width: '220px'}}
      />
    )
    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(0)
    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开
    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(0)
  })

  it('基础用法', () => {
    wrapper = mount(
      <Cascader
        onChange={changeCallback}
        options={options}
        style={{width: '220px'}}
        value={['手机', '红米', '红米4']}
      />
    )
    // 测试默认值
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '红米', '红米4'])

    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(0)
    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开
    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(1)

    // 测试默认值选中
    expect(document.querySelectorAll('.hi-cascader-menu')[0].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('手机')
    expect(document.querySelectorAll('.hi-cascader-menu')[1].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('红米')
    expect(document.querySelectorAll('.hi-cascader-menu')[2].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('红米4')

    // 测试禁用项不可点击
    document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(1)
    expect(changeCallback).not.toHaveBeenCalled()

    // 切换
    document.querySelectorAll('.hi-cascader-menu')[1].querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')).toHaveLength(2)
    expect(document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].textContent).toEqual('小米3')
    expect(document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[1].textContent).toEqual('小米4')

    // 选中小米3
    document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '小米', '小米3'])
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(changeCallback.mock.results[0].value).toEqual(['手机', '小米', '小米3'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 收起
  })

  it('自定义字段名', () => {
    const options = [
      {
        goodsId: '手机',
        goodsName: '手机',
        subGoods: [
          {
            goodsId: '小米',
            goodsName: '小米',
            subGoods: [
              {
                goodsId: '小米3',
                goodsName: '小米3'
              },
              {
                goodsId: '小米4',
                goodsName: '小米4'
              }
            ]
          },
          {
            goodsId: '红米',
            goodsName: '红米',
            subGoods: [
              {
                goodsId: '红米3',
                goodsName: '红米3'
              },
              {
                goodsId: '红米4',
                goodsName: '红米4'
              }
            ]
          }
        ]
      },
      {
        goodsId: '电视',
        goodsName: '电视',
        subGoods: [
          {
            goodsId: '小米电视4A',
            goodsName: '小米电视4A'
          },
          {
            goodsId: '小米电视4C',
            goodsName: '小米电视4C'
          }
        ]
      }
    ]
    wrapper = mount(
      <Cascader
        onChange={changeCallback}
        fieldNames={{
          label: 'goodsName',
          value: 'goodsId',
          children: 'subGoods'
        }}
        value={['手机', '红米', '红米4']}
        options={options}
        style={{width: '220px'}}
      />
    )

    // 测试默认值
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '红米', '红米4'])

    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(0)
    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开
    expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(1)

    // 测试默认值选中
    expect(document.querySelectorAll('.hi-cascader-menu')[0].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('手机')
    expect(document.querySelectorAll('.hi-cascader-menu')[1].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('红米')
    expect(document.querySelectorAll('.hi-cascader-menu')[2].querySelector('.hi-cascader-menu__item-active').textContent).toEqual('红米4')

    // 选中红米3
    document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '红米', '红米3'])
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(changeCallback.mock.results[0].value).toEqual(['手机', '红米', '红米3'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 收起
  })

  it('选择即改变', () => {
    wrapper = mount(
      <Cascader
        onActiveItemChange={activeItemChangeCallback}
        onChange={changeCallback}
        changeOnSelect={true}
        options={options}
        style={{width: '220px'}}
      />
    )

    // 测试默认值
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual([])

    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开

    document.querySelectorAll('.hi-cascader-menu')[0].querySelectorAll('.hi-cascader-menu__item')[0].click()
    // test onChange
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(changeCallback.mock.results[0].value).toEqual(['手机'])
    // test onActiveItemChange
    expect(activeItemChangeCallback).toHaveBeenCalledTimes(1)
    expect(activeItemChangeCallback.mock.results[0].value).toEqual(['手机'])
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(0) // 未收起

    document.querySelectorAll('.hi-cascader-menu')[1].querySelectorAll('.hi-cascader-menu__item')[0].click()
    // test onChange
    expect(changeCallback).toHaveBeenCalledTimes(2)
    expect(changeCallback.mock.results[1].value).toEqual(['手机', '小米'])
    // test onActiveItemChange
    expect(activeItemChangeCallback).toHaveBeenCalledTimes(2)
    expect(activeItemChangeCallback.mock.results[1].value).toEqual(['手机', '小米'])
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '小米'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(0) // 未收起

    document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].click()
    // test onChange
    expect(changeCallback).toHaveBeenCalledTimes(3)
    expect(changeCallback.mock.results[2].value).toEqual(['手机', '小米', '小米3'])
    // test onActiveItemChange
    expect(activeItemChangeCallback).toHaveBeenCalledTimes(2)
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '小米', '小米3'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 收起
  })

  it('自定义显示', () => {
    wrapper = mount(
      <Cascader
        onChange={changeCallback}
        options={options}
        style={{width: '220px'}}
        displayRender={values => {
          return values.join(' > ')
        }}
      />
    )
    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开
    document.querySelectorAll('.hi-cascader-menu')[0].querySelectorAll('.hi-cascader-menu__item')[0].click()
    document.querySelectorAll('.hi-cascader-menu')[1].querySelectorAll('.hi-cascader-menu__item')[0].click()
    document.querySelectorAll('.hi-cascader-menu')[2].querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '小米', '小米3'])
    expect(wrapper.find('.hi-cascader__input-keyword').instance().value).toEqual('手机 > 小米 > 小米3')
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 收起
  })

  it('搜索', () => {
    wrapper = mount(
      <Cascader
        onChange={changeCallback}
        noFoundTip="未搜索到相关内容"
        searchable={true}
        options={options}
        style={{width: '220px'}}
      />
    )
    wrapper.find('.hi-cascader__input-container').simulate('click') // 展开

    wrapper.find('input').simulate('change', { target: { value: '00' } }) // 无搜索结果
    wrapper.find('input').simulate('keyUp')
    expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
    expect(document.querySelector('.hi-cascader-menu__item').textContent).toEqual('未搜索到相关内容')

    wrapper.find('input').simulate('change', { target: { value: '3' } })
    wrapper.find('input').simulate('keyUp')
    expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-cascader-menu__item')).toHaveLength(2)

    document.querySelectorAll('.hi-cascader-menu__item')[0].click()
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('Cascader').state().cascaderValue).toEqual(['手机', '小米', '小米3'])
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 收起
  })
})

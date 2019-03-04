import React from 'react'
import { mount } from 'enzyme'
import Select from '../'

let wrapper
const changeCallback = jest.fn(items => items)
const successCallback = jest.fn(res => res.data)
const errorCallback = jest.fn(err => err)
jest.mock('lodash/debounce', () => jest.fn(fn => fn))
const options = [
  { name: '手机', id: '2' },
  { name: '电视', id: '3' },
  { name: '笔记本', id: '4', disabled: true },
  { name: '生活周边', id: '5' },
  { name: '办公', id: '6' }
]

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    wrapper && wrapper.unmount()
    changeCallback.mockClear()
    jest.useRealTimers()
  })

  it('禁止状态', () => {
    wrapper = mount(
      <Select
        mode='single'
        list={options}
        placeholder='请选择品类'
        style={{width: '200px'}}
        onChange={(item) => {
          console.log('单选结果', item)
        }}
        disabled
      />
    )

    wrapper.find('SelectInput').simulate('click')
    expect(document.querySelectorAll('.hi-select__popper')).toHaveLength(0)
  })

  it('单选', () => {
    wrapper = mount(
      <Select
        mode='single'
        clearable={false}
        style={{width: '200px'}}
        list={options}
        value='3'
        onChange={changeCallback}
      />
    )

    wrapper.find('SelectInput').simulate('click') // 展开
    expect(document.querySelectorAll('.hi-select__popper')).toHaveLength(1)

    expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('3')
    document.querySelectorAll('.hi-select__dropdown--item')[2].click() // 测试disabled
    expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('3')
    expect(changeCallback.mock.results.length).toBe(0)

    document.querySelectorAll('.hi-select__dropdown--item')[0].click() // 测试点击选项
    expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('2')
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 选项面板是否隐藏
    expect(changeCallback.mock.results[0].value[0].id).toEqual('2') // onChange
  })

  it('自定义模板', () => {
    wrapper = mount(
      <Select
        placeholder='请选择种类'
        style={{width: '200px'}}
        value={'3'}
        list={options}
        searchable={true}
        onChange={changeCallback}
        dropdownRender={(item, isSelected) => {
          return (
            <React.Fragment>
              <span className="option-left" style={{float: 'left'}}>{item.name}</span>
              <span className="option-right" style={{float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
            </React.Fragment>
          )
        }}
      />
    )

    wrapper.find('SelectInput').simulate('click') // 展开
    expect(document.querySelectorAll('.option-left')).toHaveLength(5) // 测试自定义模板
    expect(document.querySelectorAll('.option-right')).toHaveLength(5)

    wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索
    expect(document.querySelectorAll('.option-right')).toHaveLength(0) // 无搜索结果
    wrapper.find('input').simulate('change', { target: { value: '2' } })
    expect(document.querySelectorAll('.option-right')).toHaveLength(1)
    document.querySelectorAll('.hi-select__dropdown--item')[0].click()
    expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('2')
    expect(changeCallback.mock.results[0].value[0].id).toEqual('2')
  })

  it('异步单选', (done) => {
    const _document = document
    const mockSuccessResponse = {
      'success': true,
      'code': 200,
      'data': [
        {'name': '1-3', 'id': '3'},
        {'name': '1-2', 'id': '2'},
        {'name': '1-1', 'id': '1'},
        {'name': '1-0', 'id': '0'}
      ]
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

    wrapper = mount(
      <Select
        mode='single'
        origin={{
          type: 'GET',
          headers: {token: 'tokenXXXXXXX'},
          mode: 'cors',
          credentials: 'same-origin',
          url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
          func: successCallback
        }}
        placeholder='请选择种类'
        style={{width: '200px'}}
        onChange={changeCallback}
      />
    )
    wrapper.find('SelectInput').simulate('click') // 展开
    wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options?keyword=1',
      {
        'credentials': 'same-origin',
        'headers': {'token': 'tokenXXXXXXX'},
        'method': 'GET',
        'mode': 'cors'
      }
    )
    process.nextTick(() => {
      expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(4)

      global.fetch.mockClear()
      done()
    })
  })
})

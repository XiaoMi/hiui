import React from 'react'
import { mount, shallow } from 'enzyme'
import { Simulate } from 'react-dom/test-utils'
import sinon from 'sinon'

import Select from '../'
/* eslint-env jest */
const changeCallback = jest.fn(items => items)
const successCallback = jest.fn(res => res.data)
const errorCallback = jest.fn(err => err)
jest.mock('lodash/debounce', () => jest.fn(fn => fn))
function trigger(elem, event, code ){

  var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”
  if (code) {
    myEvent.which = code;
    myEvent.keyCode = code; // Ctrl
  }
  
  myEvent.initEvent(event, true, true);        //执行事件

  elem.dispatchEvent(myEvent);

}
const options = [
  { title: '电视', id: '3' },
  { title: '手机', id: '2' },
  { title: '笔记本', id: '4' },
  { title: '生活周边', id: '5' },
  { title: '办公', id: '6' }
]
const multiOptions = [
  { title: '手机', id: '2' },
  { title: '小米2', id: '2-1' },
  { title: '小米3', id: '2-2' },
  { title: '小米4', id: '2-3' },
  { title: '小米5', id: '2-4' },
  { title: '电脑', id: '3' },
  { title: '笔记本', id: '4' },
  { title: '生活周边', id: '5' },
  { title: '其它', id: '6' }
]
const types = ['single', 'multiple']
describe('Select', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should disabled', () => {
    types.forEach(type => {
      const wrapper = mount(<Select type={type} disabled style={{ width: 200 }} data={options} />)

      expect(wrapper.find('.hi-select__input').hasClass('disabled')).toEqual(true)
      wrapper.find('.hi-select__input').simulate('click')
      expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(false)
      wrapper.unmount()
    })
  })

  it('should have default value', () => {
    types.forEach(type => {
      const wrapper = mount(
        <Select
          type={type}
          style={{ width: 200 }}
          data={type === 'single' ? options : multiOptions}
          defaultValue={type === 'single' ? '3' : ['2', '3']}
        />
      )
      if (type === 'single') {
        expect(
          wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()
        ).toEqual('电视')
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown--item')[2].click()
        wrapper.update()
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(false)
        expect(
          wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()
        ).toEqual('笔记本')
      }

      if (type === 'multiple') {
        expect(
          wrapper
            .find('.hi-select__input')
            .find('.hi-select__input--item')
            .map(val => val.find('.hi-select__input--item__name').text())
        ).toEqual(['手机', '电脑'])
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document
          .querySelectorAll('.hi-select__dropdown')[0]
          .querySelectorAll('.hi-select__dropdown--item')[2]
          .click()
        wrapper.update()
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        expect(
          wrapper
            .find('.hi-select__input')
            .find('.hi-select__input--item')
            .map(val => val.find('.hi-select__input--item__name').text())
        ).toEqual(['手机', '电脑', '小米3'])
      }
      wrapper.unmount()
    })
  })

  it('should control by value', () => {
    types.forEach(type => {
      const wrapper = mount(
        <Select
          type={type}
          style={{ width: 200 }}
          data={type === 'single' ? options : multiOptions}
          value={type === 'single' ? '2' : ['2', '4']}
          defaultValue={type === 'single' ? '3' : ['2', '3']}
        />
      )
      if (type === 'single') {
        expect(
          wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()
        ).toEqual('手机')
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown--item')[2].click()
        expect(
          wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()
        ).toEqual('手机')
        wrapper.setProps({
          value: '6'
        })
        expect(
          wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()
        ).toEqual('办公')
      }

      if (type === 'multiple') {
        expect(
          wrapper
            .find('.hi-select__input')
            .find('.hi-select__input--item')
            .map(val => val.find('.hi-select__input--item__name').text())
        ).toEqual(['手机', '笔记本'])
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document
          .querySelectorAll('.hi-select__dropdown')[0]
          .querySelectorAll('.hi-select__dropdown--item')[2]
          .click()
        expect(
          wrapper
            .find('.hi-select__input')
            .find('.hi-select__input--item')
            .map(val => val.find('.hi-select__input--item__name').text())
        ).toEqual(['手机', '笔记本'])
        wrapper.setProps({
          value: ['4', '5', '6']
        })
        expect(
          wrapper
            .find('.hi-select__input')
            .find('.hi-select__input--item')
            .map(val => val.find('.hi-select__input--item__name').text())
        ).toEqual(['笔记本', '生活周边', '其它'])
      }
      wrapper.unmount()
    })
  })

  it('should can delete one in multiple select', () => {
    const wrapper = mount(
      <Select
        type="multiple"
        style={{ width: '300px' }}
        optionWidth={400}
        data={multiOptions}
        defaultValue={['4', '5', '2', '3']}
        searchable={true}
        placeholder="请选择..."
        noFoundTip="无匹配数据"
        onChange={changeCallback}
      />
    )
    expect(wrapper.find('.hi-select__input--item')).toHaveLength(4)
    wrapper.find('.hi-select__input--item__remove').at(0).simulate('click') // 删除第一个
    expect(wrapper.find('.hi-select__input--item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should can delete all in multiple select', () => {
    const wrapper = mount(
      <Select
        type="multiple"
        style={{ width: '300px' }}
        optionWidth={400}
        data={multiOptions}
        defaultValue={['4', '5', '2', '3']}
        searchable={true}
        placeholder="请选择..."
        noFoundTip="无匹配数据"
        onChange={changeCallback}
      />
    )
    expect(wrapper.find('.hi-select__input--item')).toHaveLength(4)
    wrapper.find('.hi-select__input').simulate('focus')
    wrapper.find('.hi-select__input--icon__close').simulate('click')
    expect(wrapper.find('.hi-select__input--item')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should can check all in multiple select', () => {
    const wrapper = mount(
      <Select
        type="multiple"
        style={{ width: '300px' }}
        optionWidth={400}
        data={multiOptions}
        defaultValue={['4', '5', '2', '3']}
        searchable={true}
        showCheckAll={true}
        placeholder="请选择..."
        noFoundTip="无匹配数据"
      />
    )
    wrapper.find('.hi-select__input').simulate('click')
    expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
    document.querySelector('.hi-select__dropdown__searchbar--input').value = '米' 
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'input')
    document.querySelectorAll('.hi-select__dropdown-check-all')[0].click()
    expect(document.querySelectorAll('.hi-checkbox__input--checked')).toHaveLength(4)
    wrapper.unmount()
  })

  it('should custom render dropdown list', () => {
    const wrapper = mount(
      <Select
        placeholder="请选择种类"
        style={{ width: '200px' }}
        value={'3'}
        data={options}
        searchable={true}
        render={(item, isSelected) => {
          return (
            <React.Fragment>
              <span className="option-left" style={{ float: 'left' }}>
                {item.name}
              </span>
              <span
                className="option-right"
                style={{ float: 'right', color: '#999', fontSize: 14 }}
              >
                {item.id}
              </span>
            </React.Fragment>
          )
        }}
      />
    )

    wrapper.find('.hi-select__input').simulate('click') // 展开
    expect(document.querySelectorAll('.option-left')).toHaveLength(5) // 测试自定义模板
    expect(document.querySelectorAll('.option-right')).toHaveLength(5)
    wrapper.unmount()
  })

  it('should handle keydown', () => {
    const wrapper = mount(
      <Select
        type="single"
        placeholder="请选择种类"
        style={{ width: '200px' }}
        defaultValue={'3'}
        data={options}
      />
    )

    wrapper.find('.hi-select__input').simulate('click')
    Simulate.mouseEnter(document.querySelectorAll('.hi-select__dropdown--item')[1])
    expect(
      document.querySelectorAll('.hi-select__dropdown--item')[1].getAttribute('data-focused')
    ).toEqual('true')
    wrapper.unmount()
  })

  it('should handle mouseEnter', () => {
    const wrapper = mount(
      <Select
        type="single"
        placeholder="请选择种类"
        style={{ width: '200px' }}
        defaultValue={'3'}
        data={options}
      />
    )

    wrapper.find('.hi-select__input').simulate('click')
    expect(
      document.querySelectorAll('.hi-select__dropdown--item')[0].getAttribute('data-focused')
    ).toEqual('true')
    wrapper.find('.hi-select__input--search').find('input').simulate('keydown', { keyCode: 40 })
    expect(
      document.querySelectorAll('.hi-select__dropdown--item')[0].getAttribute('data-focused')
    ).toEqual('false')
    wrapper.find('.hi-select__input--search').find('input').simulate('keydown', { keyCode: 13 })
    expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual(
      '手机'
    )
    wrapper.find('.hi-select__input').simulate('click')
    wrapper.find('.hi-select__input--search').find('input').simulate('keydown', { keyCode: 38 })
    wrapper.find('.hi-select__input--search').find('input').simulate('keydown', { keyCode: 13 })
    expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual(
      '电视'
    )
    wrapper.unmount()
  })
  it('should handle mouseEnter when searchable', () => {
    const wrapper = mount(
      <Select
        type="single"
        placeholder="请选择种类"
        style={{ width: '200px' }}
        searchable
        defaultValue={'2'}
        data={options}
      />
    )
    
    wrapper.find('.hi-select__input').simulate('click')
    expect(document.querySelectorAll('.hi-select__dropdown__searchbar--input')).toHaveLength(1)
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'focus')
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'keydown',40)

    expect(
      document.querySelectorAll('.hi-select__dropdown--item')[1].getAttribute('data-focused')
    ).toEqual('true')
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'keydown',13)

    expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual(
      '手机'
    )
    wrapper.find('.hi-select__input').simulate('click')
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'focus')
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'keydown',38)
    expect(
      document.querySelectorAll('.hi-select__dropdown--item')[0].getAttribute('data-focused')
    ).toEqual('true')
    trigger(document.querySelector('.hi-select__dropdown__searchbar--input'),'keydown',13)
    expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual(
      '电视'
    )
    wrapper.unmount()
  })

  it('should close when click outside', () => {
    const outsideDom = document.createElement('div')
    const wrapper = mount(
      <Select
        type="single"
        placeholder="请选择种类"
        style={{ width: '200px' }}
        defaultValue={'3'}
        data={options}
      />
    )

    document.body.appendChild(outsideDom)

    wrapper.find('.hi-select__input').simulate('click')
    expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
    outsideDom.click()
    wrapper.update()
    expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(false)

    outsideDom.remove()
    wrapper.unmount()
  })

  it('异步单选', done => {
    const _document = document
    const mockSuccessResponse = {
      success: true,
      code: 200,
      data: [
        { title: '1-0', id: '0' },
        { title: '1-1', id: '1' },
        { title: '1-2', id: '2' },
        { title: '1-3', id: '3' }
      ]
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse)
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

    const wrapper = mount(
      <Select
        mode="single"
        dataSource={{
          type: 'GET',
          key: 'id',
          url: 'http://yapi.demo.qunar.com/mock/26534/hiui/select',
          transformResponse: res => {
            return res.data
          }
        }}
        placeholder="请选择种类"
        style={{ width: '200px' }}
        onChange={changeCallback}
      />
    )
    wrapper.find('.hi-select__input').simulate('click') // 展开
    wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(
      global.fetch
    ).toHaveBeenCalledWith('http://yapi.demo.qunar.com/mock/26534/hiui/select?id=1', {
      method: 'GET'
    })
    process.nextTick(() => {
      expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(4)
      global.fetch.mockClear()
      done()
      wrapper.unmount()
    })
  })

  it('异步多选首次加载数据', done => {
    const _document = document
    const mockSuccessResponse = {
      success: true,
      code: 200,
      data: [
        { title: '1-0', id: '0' },
        { title: '1-1', id: '1' },
        { title: '1-2', id: '2' },
        { title: '1-3', id: '3' }
      ]
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

    const wrapper = mount(
      <Select
        mode="single"
        dataSource={{
          type: 'GET',
          key: 'id',
          url: 'http://yapi.demo.qunar.com/mock/26534/hiui/select',
          transformResponse: res => {
            return res.data
          }
        }}
        autoload
        placeholder="请选择种类"
        style={{ width: '200px' }}
        onChange={changeCallback}
      />
    )
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(
      global.fetch
    ).toHaveBeenCalledWith('http://yapi.demo.qunar.com/mock/26534/hiui/select', {
      method: 'GET'
    })
    process.nextTick(() => {
      // 首次加载数据
      wrapper.find('.hi-select__input').simulate('click') // 展开
      expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(1)
      global.fetch.mockClear()
      done()
    })
  })
})

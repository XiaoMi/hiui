import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Pagination from '../'
import Dropdown from '../../dropdown'

const jumpCallback = jest.fn(key => key)
const sizeChangeCallback = jest.fn((val, current) => [val, current])
const pageChangeCallback = jest.fn((page, prevPage, pageSize) => [page, prevPage, pageSize])
const pageSizeOptions = [{
  value: 10,
  title: '10'
}, {
  value: 20,
  title: '20'
}, {
  value: 50,
  title: '50'
}, {
  value: 100,
  title: '100'
}]

describe('Pagination', () => {
  it('normal', () => {
    const wrapper = mount(
      <Pagination
        total={60000}
        showTotal
        pageSize={10}
        pageSizeOptions={pageSizeOptions}
        defaultCurrent={1}
        showTotal={true}
        showQuickJumper={true}
        jumpEvent={jumpCallback}
        sizeChangeEvent={sizeChangeCallback}
        onChange={pageChangeCallback}
      />
    )

    expect(wrapper.find('.hi-pagination__item--active a').text()).toEqual('1')

    wrapper.find('.hi-pagination__item-3').simulate('click') // 切换页码
    expect(wrapper.find('.hi-pagination__item--active a').text()).toEqual('3')
    expect(pageChangeCallback.mock.results[0].value).toEqual([3, 1, 10])

    wrapper.find('.hi-dropdown').getDOMNode().click() // 指定每页可以显示多少条
    document.querySelectorAll('.hi-dropdown__item')[3].click() // 每页显示100条
    // expect(wrapper.find('.hi-pagination__item a').at(7).text()).toEqual('600')
    // wrapper.find('.collapse-item__head').at(0).simulate('click') // test disabled

    wrapper.find('input').simulate('change', { target: { value: '10' } }) // 测试跳转
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('.hi-pagination__item--active a').text()).toEqual('10')
    expect(jumpCallback.mock.results[0].value).toBe(10)

    jumpCallback.mockClear()
    pageChangeCallback.mockClear()
    wrapper.unmount()
  })

  it('shrink', () => {
    const wrapper = mount(
      <Pagination
        mode='shrink'
        defaultCurrent={2}
        showQuickJumper={true}
        total={250}
        jumpEvent={jumpCallback}
        pageSize={30}
        onChange={(page, prevPage, pageSize) => { console.log(page, prevPage, pageSize) }}
      />
    )

    wrapper.find('.hi-pagination__item').at(0).simulate('click') // 测试上一页
    expect(wrapper.find('input').props().value).toEqual(1)

    wrapper.find('input').simulate('change', { target: { value: '3' } }) // 测试跳转
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual(3)
    expect(jumpCallback.mock.results[0].value).toBe(3)

    wrapper.find('input').simulate('change', { target: { value: '100' } }) // 测试超过最大页
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual(9)
    expect(jumpCallback.mock.results[1].value).toBe(9)

    jumpCallback.mockClear()
    pageChangeCallback.mockClear()
    wrapper.unmount()
  })

  it('simple', () => {
    const wrapper = mount(
      <Pagination
        mode='simple'
        defaultCurrent={2}
        showQuickJumper={true}
        total={250}
        jumpEvent={jumpCallback}
        pageSize={30}
        onChange={(page, prevPage, pageSize) => { console.log(page, prevPage, pageSize) }}
      />
    )

    wrapper.find('input').simulate('change', { target: { value: '3' } }) // 测试跳转
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual(3)
    expect(jumpCallback.mock.results[0].value).toBe(3)

    wrapper.find('input').simulate('change', { target: { value: '100' } }) // 测试超过最大页
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual(9)
    expect(jumpCallback.mock.results[1].value).toBe(9)
  })
})

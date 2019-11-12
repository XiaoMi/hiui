import React from 'react'
import { mount } from 'enzyme'
import ProviderPagination, {Pagination} from '../Pagination'
import simulant from 'simulant'
import Input from '../../input/Input'
/* eslint-env jest */
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
  describe('PropTypes', () => {
    it('type', () => {
      const types = ['default', 'simple', 'shrink']
      const wrapper = mount(
        <div>
          {
            types.map((type, index) => <ProviderPagination total={100} pageSize={10} type={type} key={index} />)
          }
        </div>
      )
      types.map(type => {
        expect(wrapper.find(`.hi-pagination--${type}`)).toHaveLength(1)
      })
    })
    it('total & defaultCurrent', () => {
      const dc = 2
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} defaultCurrent={dc} />
      )
      expect(wrapper.find(`.hi-pagination__item-${dc}`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.setProps({defaultCurrent: 3})
      expect(wrapper.find(`.hi-pagination__item-${dc}`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.setProps({total: 200})
      expect(wrapper.find('.hi-pagination__item-20')).toHaveLength(1)
    })
    it('current', () => {
      const dc = 2
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} current={dc} />
      )
      expect(wrapper.find(`.hi-pagination__item-${dc}`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.setProps({current: 3})
      expect(wrapper.find(`.hi-pagination__item-3`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.setProps({current: 0})
      expect(wrapper.find(`.hi-pagination__item-1`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.setProps({current: 100})
      expect(wrapper.find(`.hi-pagination__item-10`).hasClass('hi-pagination__item--active')).toBeTruthy()
    })
    it('max', () => {
      // TODO:MAX 属性
      const wrapper = mount(
        <ProviderPagination current={1} total={200} pageSize={10}/>
      )
      wrapper.setProps({current: 3})
      expect(wrapper.find(`.hi-pagination__item-3`).hasClass('hi-pagination__item--active')).toBeTruthy()
      wrapper.find('.hi-pagination__item-1').at(0).simulate('click')
      wrapper.find('.hi-pagination__item-4').at(0).simulate('click')
    })
    it('pageSize', () => {
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} />
      )
      expect(wrapper.find(`.hi-pagination__item-10`)).toHaveLength(1)
      wrapper.setProps({pageSize: 5})
      expect(wrapper.find(`.hi-pagination__item-20`)).toHaveLength(1)
    })
    it('pageSizeOptions && onPageSizeChange', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} pageSizeOptions={[10, 20, 50]} onPageSizeChange={callback} />
      )
      expect(wrapper.find('.hi-pagination__sizes')).toHaveLength(1)
      wrapper.find('.hi-select__input').simulate('click')
      simulant.fire(document.querySelectorAll('.hi-select__dropdown--item')[1], 'click')
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledWith(20, 1)
      expect(wrapper.find(Pagination).state('pageSize')).toEqual(20)
    })
    it('autoHide', () => {
      const wrapper = mount(
        <ProviderPagination total={10} pageSize={10} autoHide />
      )
      expect(wrapper.find('.hi-pagination')).toHaveLength(0)
    })
    it('showJumper', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <ProviderPagination total={20} pageSize={10} showJumper onJump={callback} />
      )
      expect(wrapper.find('.hi-pagination__jumper')).toHaveLength(1)
      // wrapper.find(Pagination).setState({jumpTo: 2})
      // wrapper.find('.hi-input__text').simulate('change')
      wrapper.find('.hi-input__text').simulate('blur', {target: {value: 2}})
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledWith(2)
      wrapper.find('.hi-input__text').simulate('keypress', {type: 'keypress', charCode: 13})
    })
    it('onChange', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} showJumper onChange={callback} />
      )
      wrapper.find('.hi-pagination__item-2').at(0).simulate('click')
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledWith(2, 1, 10)

      wrapper.find(Pagination).setState({jumpTo: ''})
      wrapper.find('.hi-input__text').simulate('change')
      wrapper.find(Pagination).setState({jumpTo: 3})
      wrapper.find('.hi-input__text').simulate('change')
      expect(callback).toHaveBeenCalledWith(2, 1, 10)
      wrapper.find(Pagination).setState({jumpTo: 0})
      wrapper.find('.hi-input__text').simulate('change')
      wrapper.find(Pagination).setState({jumpTo: 'ab'})
      wrapper.find('.hi-input__text').simulate('change')
      wrapper.find('.hi-input__text').simulate('change', {target: {value: 5}})
      expect(wrapper.find(Pagination).state('jumpTo')).toEqual(5)
      wrapper.find('.hi-input__text').simulate('change', {target: {value: 50}})
      expect(wrapper.find(Pagination).state('jumpTo')).toEqual(10)
    })
  })
  describe('Branches', () => {
    it('Normal', () => {
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} showTotal />
      )
      expect(wrapper.find('.hi-pagination__total')).toHaveLength(1)
    })
    it('Shrink', () => {
      const wrapper = mount(
        <ProviderPagination total={1} pageSize={10} type='shrink' showJumper />
      )
      expect(wrapper.find('.hi-pagination__jumper-input')).toHaveLength(1)
    })
    it('PageSizeOption', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <ProviderPagination total={100} pageSize={10} pageSizeOptions={[{value: 10}, {value: 20}]} onPageSizeChange={callback} />
      )
      expect(wrapper.find('.hi-pagination__sizes')).toHaveLength(1)
    })
  })
})

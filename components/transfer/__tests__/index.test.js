import React from 'react'
import { mount } from 'enzyme'
import Transfer from '../'

const randomData = () => {
  let arr = []
  for (let i = 1; i < 16; i++) {
    arr.push({
      id: i,
      content: '选项' + i,
      disabled: i % 3 === 0
    })
  }
  return arr
}

describe('Transfer', () => {
  it('basic', () => {
    const cb = jest.fn()
    const wrapper = mount(
      <Transfer
        emptyContent={['空', '无数据']}
        title={['左标题', '右标题']}
        targetIds={[2, 3]}
        data={randomData()}
        onChange={cb}
      />
    )
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item')).toHaveLength(
      13
    )
    expect(
      wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__title').text()
    ).toEqual('左标题')
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__item')).toHaveLength(2)
    expect(
      wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__title').text()
    ).toEqual('右标题')
    wrapper
      .find('.hi-transfer__container')
      .at(0)
      .find('.hi-transfer__item--disabled')
      .at(0)
      .simulate('click')
    expect(cb).not.toHaveBeenCalled()
    wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item').at(0).simulate('click')
    expect(cb).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should update when props change', () => {
    const cb = jest.fn()
    const wrapper = mount(
      <Transfer
        emptyContent={['空', '无数据']}
        title={['左标题', '右标题']}
        targetIds={[2, 3]}
        data={randomData()}
        onChange={cb}
      />
    )
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item')).toHaveLength(
      13
    )
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__item')).toHaveLength(2)
    wrapper.setProps({ targetIds: [1, 2, 3] })
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item')).toHaveLength(
      12
    )
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('multiple', () => {
    const cb = jest.fn()
    const wrapper = mount(
      <Transfer
        type="multiple"
        emptyContent={['空', '无数据']}
        title={['左标题', '右标题']}
        targetIds={[2, 3]}
        data={randomData()}
        onChange={cb}
      />
    )
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item')).toHaveLength(
      13
    )
    expect(
      wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__title').text()
    ).toEqual('左标题')
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__item')).toHaveLength(2)
    expect(
      wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__title').text()
    ).toEqual('右标题')
    expect(wrapper.find('.hi-transfer__operation ButtonWrapper')).toHaveLength(2)
    wrapper
      .find('.hi-transfer__container')
      .at(0)
      .find('.hi-transfer__item')
      .at(0)
      .find('CheckBox')
      .simulate('click')
    expect(
      wrapper.find('.hi-transfer__container').at(0).find('.hi-checkbox-legacy--checked')
    ).toHaveLength(1)
    wrapper
      .find('.hi-transfer__container')
      .at(0)
      .find('.hi-transfer__item--disabled')
      .at(0)
      .find('CheckBox')
      .simulate('click')
    expect(
      wrapper.find('.hi-transfer__container').at(0).find('.hi-checkbox-legacy--checked')
    ).toHaveLength(1)
    wrapper.find('.hi-transfer__operation ButtonWrapper').at(0).simulate('click')
    expect(cb).toHaveBeenCalled()
    wrapper
      .find('.hi-transfer__container')
      .at(1)
      .find('.hi-transfer__item')
      .at(0)
      .find('CheckBox')
      .simulate('click')
    expect(
      wrapper.find('.hi-transfer__container').at(1).find('.hi-checkbox-legacy--checked')
    ).toHaveLength(1)
    wrapper.find('.hi-transfer__operation ButtonWrapper').at(1).simulate('click')
    expect(cb).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('can check all', () => {
    const cb = jest.fn()
    const wrapper = mount(
      <Transfer
        type="multiple"
        emptyContent={['空', '无数据']}
        title={['左标题', '右标题']}
        targetIds={[2, 3]}
        data={randomData()}
        onChange={cb}
        showCheckAll
      />
    )

    wrapper
      .find('.hi-transfer__footer')
      .at(0)
      .find('Checkbox')
      .at(1)
      .find('input')
      .simulate('change')
    expect(
      wrapper.find('.hi-transfer__container').at(0).find('.hi-checkbox-legacy--checked')
    ).toHaveLength(9)
    wrapper.unmount()
  })
})

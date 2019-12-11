import React from "react"
import { mount } from "enzyme"
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
    const wrapper = mount(<Transfer
      emptyContent={['空', '无数据']}
      title={['左标题', '右标题']}
      targetIds={[2,3]}
      data={randomData()}
      onChange={cb}
    />)
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item')).toHaveLength(13)
    expect(wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__title').text()).toEqual('左标题')
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__item')).toHaveLength(2)
    expect(wrapper.find('.hi-transfer__container').at(1).find('.hi-transfer__title').text()).toEqual('右标题')
    wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item').at(0).simulate('click')
    expect(cb).toHaveBeenCalled()
    wrapper.find('.hi-transfer__container').at(0).find('.hi-transfer__item--disabled').at(0).simulate('click')
    console.log()
    expect(cb).not.toHaveBeenCalled()
  })
})

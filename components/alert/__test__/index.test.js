import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Alert from '../alert'

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  // it('basic use', () => {
  //   const wrapper = renderer.create(
  //     <div>
  //       <Alert type='info' message='新提示' />
  //       <Alert type='success' message='成功' />
  //       <Alert type='error' message='错误' />
  //       <Alert type='warning' message='警告' />
  //     </div>
  //   )
  //   expect(wrapper).toMatchSnapshot()
  // })
  it('could be closed', () => {
    const onClose = jest.fn()
    const wrapper = mount(<Alert type="info" message="信息提示的文案" onClose={onClose} />)
    wrapper.find('.close-btn').simulate('click')
    expect(onClose).toBeCalled()
    console.log(wrapper.find('.hi-alert'))
    expect(wrapper.find('.hi-alert')).toHaveLength(0)
  })

  // it('props update', () => {
  //   const onClose = jest.fn()
  //   const wrapper = mount(
  //     <Alert type='info' message='信息提示的文案' onClose={onClose} />
  //   )
  //   expect(wrapper.props().message).toEqual('信息提示的文案')
  //   wrapper.setProps({message: '新方案'})
  //   expect(wrapper.props().message).toEqual('新方案')
  // })

  it('auto close', () => {
    const onClose = jest.fn()
    const wrapper = mount(
      <Alert type="info" message="信息提示的文案" autoClose closeable={false} onClose={onClose} />
    )
    expect(wrapper.find('.hi-alert')).toHaveLength(1)
    expect(onClose).not.toBeCalled()
    jest.runAllTimers()
    expect(onClose).toBeCalled()
    // expect(onClose).toHaveBeenCalledTimes(1)
    console.dir(wrapper.find('.hi-alert'))
    // expect(wrapper.find('.hi-alert')).toHaveLength(0)
    // expect(wrapper.find('.hi-alert').exists()).toBeTruthy()
  })
})

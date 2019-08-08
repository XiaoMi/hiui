import React from 'react'
import { mount } from 'enzyme'
import Alert from '../alert'

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('could be closed', () => {
    const onClose = jest.fn()
    const wrapper = mount(<Alert type="info" message="信息提示的文案" onClose={onClose} />)
    wrapper.find('.close-btn').simulate('click')
    expect(onClose).toBeCalled()
    console.log(wrapper.find('.hi-alert'))
    expect(wrapper.find('.hi-alert')).toHaveLength(0)
  })


  it('auto close', () => {
    const onClose = jest.fn()
    const wrapper = mount(
      <Alert type="info" message="信息提示的文案" autoClose closeable={false} onClose={onClose} />
    )
    expect(wrapper.find('.hi-alert')).toHaveLength(1)
    expect(onClose).not.toBeCalled()
    jest.runAllTimers()
    expect(onClose).toBeCalled()
    console.dir(wrapper.find('.hi-alert'))

  })
})

import React from 'react'
import { mount } from 'enzyme'
import Form from '../index'
import Input from '../../input'
import _Form from '../Form'
import FormItem from '../Item'

describe('Form', () => {
  it('should have the correct placement', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label="账号" labelWidth="50">
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label="密码" labelWidth="50">
          <Input type="password" placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(wrapper.find('.hi-form--line')).toHaveLength(0)
    wrapper.setProps({ placement: 'vertical' })
    expect(wrapper.find('.hi-form--line')).toHaveLength(0)
    wrapper.setProps({ placement: 'horizontal' })
    expect(wrapper.find('.hi-form--inline')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should align the label by labelPlacement', () => {
    ;['left', 'right', 'top'].forEach(labelPlacement => {
      const wrapper = mount(
        <Form labelPlacement={labelPlacement}>
          <Form.Item label="账号" labelWidth="50">
            <Input placeholder={'账号'} />
          </Form.Item>
          <Form.Item label="密码" labelWidth="50">
            <Input type="password" placeholder={'密码'} />
          </Form.Item>
        </Form>
      )
      expect(wrapper.find(`.hi-form--label--${labelPlacement}`)).toHaveLength(1)
      const wrapperLegacy = mount(
        <Form labelPositon={labelPlacement}>
          <Form.Item label="账号" labelWidth="50">
            <Input placeholder={'账号'} />
          </Form.Item>
          <Form.Item label="密码" labelWidth="50">
            <Input type="password" placeholder={'密码'} />
          </Form.Item>
        </Form>
      )
      expect(wrapperLegacy.find(`.hi-form--label--${labelPlacement}`)).toHaveLength(1)
      wrapper.unmount()
      wrapperLegacy.unmount()
    })
  })

  it('should have the label width', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label="账号" labelWidth="50">
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label="密码" labelWidth="50">
          <Input type="password" placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(
      wrapper.find('label.hi-form-item__label').map(label => label.prop('style').width)
    ).toEqual([50, 50])
    wrapper.unmount()
  })

  it('should show colon', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label="账号" labelWidth="50">
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label="密码" labelWidth="50">
          <Input type="password" placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(wrapper.find('label.hi-form-item__label').map(label => label.text())).toEqual([
      '账号：',
      '密码：'
    ])
    wrapper.setProps({ showColon: false })
    expect(wrapper.find('label.hi-form-item__label').map(label => label.text())).toEqual([
      '账号',
      '密码'
    ])
    wrapper.unmount()
  })

  it('should field has colon when field showColon is true and form showColon is false', () => {
    const wrapper = mount(
      <Form showColon={false}>
        <Form.Item label="账号" labelWidth="50" showColon>
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label="密码" labelWidth="50">
          <Input type="password" placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(wrapper.find('label.hi-form-item__label').map(label => label.text())).toEqual([
      '账号：',
      '密码'
    ])
    wrapper.unmount()
  })

  it('should validate require field', () => {
    jest.useFakeTimers()
    const localeDatas = {
      form: {
        colon: '：'
      }
    }
    const blurCb = jest.fn()
    const wrapper = mount(
      <_Form
        rules={{
          name: {
            required: true,
            message: '请输入名称',
            trigger: 'onChange'
          }
        }}
        localeDatas={localeDatas}
        model={{
          name: ''
        }}
      >
        <FormItem label="名称" field="name">
          <Input
            placeholder="name"
            onChange={e => {
              wrapper.setProps({ model: { name: e.target.value } })
            }}
            onBlur={blurCb}
          />
        </FormItem>
      </_Form>
    )
    const cb = jest.fn()
    wrapper.instance().validate(cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('请输入名称')
    wrapper.find('input').simulate('change', { target: { value: 'hiui' } })
    jest.runAllTimers()
    wrapper.instance().validate(cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('')
    wrapper.find('input').simulate('change', { target: { value: '' } })
    jest.runAllTimers()
    wrapper.find('input').simulate('blur')
    jest.runAllTimers()
    expect(blurCb).toHaveBeenCalled()
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('请输入名称')
    wrapper.unmount()

    jest.useRealTimers()
  })

  it('should validate single field', () => {
    jest.useFakeTimers()
    const localeDatas = {
      form: {
        colon: '：'
      }
    }
    const wrapper = mount(
      <_Form
        rules={{
          name: {
            required: true,
            message: '请输入名称',
            trigger: 'onChange'
          }
        }}
        localeDatas={localeDatas}
        model={{
          name: ''
        }}
      >
        <FormItem label="名称" field="name">
          <Input
            placeholder="name"
            onChange={e => {
              wrapper.setProps({ model: { name: e.target.value } })
            }}
            onBlur={jest.fn()}
          />
        </FormItem>
      </_Form>
    )
    const cb = jest.fn()
    wrapper.instance().validateField('name', cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('请输入名称')
    wrapper.find('input').simulate('change', { target: { value: 'hiui' } })
    jest.runAllTimers()
    wrapper.instance().validate(cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('')
    expect(() => wrapper.instance().validateField('errorField', cb)).toThrow()
    wrapper.unmount()

    jest.useRealTimers()
  })
})

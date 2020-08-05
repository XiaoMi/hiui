import React from 'react'
import { mount } from 'enzyme'
import Form from '../index'
import Input from '../../input'
import _Form from '../Form'
import FormItem from '../Item'
import Grid from '../../grid'
import Button from '../../button'
import Radio from '../../radio'
class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.state = {
      form: {
        name: '',
        region: '',
        count: ''
      },
      checkedIndex: -1,
      rules: {
        name: [
          {
            required: true,
            message: <span style={{ color: '#ccc' }}>请输入名称</span>,
            trigger: 'onBlur,onChange'
          }
        ],
        region: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'onChange'
          }
        ],
        count: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'onChange'
          },
          {
            validator: (rule, value, cb) => {
              const count = parseInt(value)
              if (isNaN(count)) {
                cb('请输入数字')
              } else if (count <= 0) {
                cb('必须是正数')
              } else {
                cb()
              }
            },
            trigger: 'onChange'
          }
        ]
      }
    }
  }

  handleSubmit() {
    this.form.current.validate(valid => {
      if (valid) {
        console.log(this.state.form)
        alert('submit')
      } else {
        console.log('error')
        return false
      }
    })
  }

  cancelSubmit() {
    this.setState({
      form: {
        name: '',
        region: '',
        count: ''
      }
    })
    this.form.current.resetValidates()
  }

  handleChange(key, e, value, index) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    })

    if (index !== undefined) {
      this.setState({
        checkedIndex: index
      })
    }
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { form, checkedIndex } = this.state

    return (
      <div>
        <Form
          ref={this.form}
          model={form}
          rules={this.state.rules}
          labelWidth='80'
        >
          <Row>
            <Col span={12}>
              <Form.Item label='名称' prop='name'>
                <Input
                  value={form.name}
                  placeholder={'name'}
                  onChange={this.handleChange.bind(this, 'name')}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={this.handleSubmit.bind(this)}>
                  提交
                </Button>
                <Button onClick={this.cancelSubmit.bind(this)}>重置</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
class Demo2 extends React.Component {
  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.state = {
      form: {
        name: '',
        region: '',
        count: ''
      },
      checkedIndex: -1,
      rules: {
        name: [
          {
            required: true,
            message: <span style={{ color: '#ccc' }}>请输入名称</span>,
            trigger: 'onBlur,onChange'
          }
        ],
        region: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'onChange'
          }
        ],
        count: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'onChange'
          },
          {
            validator: (rule, value, cb) => {
              const count = parseInt(value)
              if (isNaN(count)) {
                cb('请输入数字')
              } else if (count <= 0) {
                cb('必须是正数')
              } else {
                cb()
              }
            },
            trigger: 'onChange'
          }
        ]
      }
    }
  }

  handleSubmit() {
    this.form.current.validate(valid => {
      if (valid) {
        console.log(this.state.form)
        alert('submit')
      } else {
        console.log('error')
        return false
      }
    })
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { form } = this.state

    return (
      <div>
        <Form
          ref={this.form}
          model={form}
          rules={this.state.rules}
          labelWidth='80'
        >
          <Row>
            <Col span={12}>
              <Form.Item>
                <Button type='primary' onClick={this.handleSubmit.bind(this)}>
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
class Demo3 extends React.Component {
  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.state = {
      form: {
        name: '',
        region: '',
        count: ''
      },
      checkedIndex: -1
    }
  }

  handleSubmit() {
    this.form.current.validate(valid => {
      if (valid) {
        console.log(this.state.form)
        alert('submit')
      } else {
        console.log('error')
        return false
      }
    })
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { form } = this.state
    return (
      <div>
        <Form ref={this.form} model={form} labelWidth='80'>
          <Row>
            <Col span={12}>
              <Form.Item label='名称' prop='name'>
                <Input value={form.name} placeholder={'name'} />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={this.handleSubmit.bind(this)}>
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
describe('Form', () => {
  it('should have the correct placement', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label='账号' labelWidth='50'>
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label='密码' labelWidth='50'>
          <Input type='password' placeholder={'密码'} />
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
          <Form.Item label='账号' labelWidth='50'>
            <Input placeholder={'账号'} />
          </Form.Item>
          <Form.Item label='密码' labelWidth='50'>
            <Input type='password' placeholder={'密码'} />
          </Form.Item>
        </Form>
      )
      expect(wrapper.find(`.hi-form--label--${labelPlacement}`)).toHaveLength(1)
      const wrapperLegacy = mount(
        <Form labelPositon={labelPlacement}>
          <Form.Item label='账号' labelWidth='50'>
            <Input placeholder={'账号'} />
          </Form.Item>
          <Form.Item label='密码' labelWidth='50'>
            <Input type='password' placeholder={'密码'} />
          </Form.Item>
        </Form>
      )
      // expect(wrapperLegacy.find(`.hi-form--label--${labelPlacement}`)).toHaveLength(1)
      wrapper.unmount()
      wrapperLegacy.unmount()
    })
  })

  it('should have the label width', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label='账号' labelWidth='50'>
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label='密码' labelWidth='50'>
          <Input type='password' placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(
      wrapper
        .find('label.hi-form-item__label')
        .map(label => label.prop('style').width)
    ).toEqual([50, 50])
    wrapper.unmount()
  })

  it('should show colon', () => {
    const wrapper = mount(
      <Form>
        <Form.Item label='账号' labelWidth='50'>
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label='密码' labelWidth='50'>
          <Input type='password' placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(
      wrapper.find('label.hi-form-item__label').map(label => label.text())
    ).toEqual(['账号：', '密码：'])
    wrapper.setProps({ showColon: false })
    expect(
      wrapper.find('label.hi-form-item__label').map(label => label.text())
    ).toEqual(['账号', '密码'])
    wrapper.unmount()
  })

  it('should field has colon when field showColon is true and form showColon is false', () => {
    const wrapper = mount(
      <Form showColon={false}>
        <Form.Item label='账号' labelWidth='50' showColon>
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item label='密码' labelWidth='50'>
          <Input type='password' placeholder={'密码'} />
        </Form.Item>
      </Form>
    )
    expect(
      wrapper.find('label.hi-form-item__label').map(label => label.text())
    ).toEqual(['账号：', '密码'])
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
        <FormItem label='名称' field='name'>
          <Input
            placeholder='name'
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
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual(
      '请输入名称'
    )
    wrapper.find('input').simulate('change', { target: { value: 'hiui' } })
    jest.runAllTimers()
    wrapper.instance().validate(cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('')
    wrapper.find('input').simulate('change', { target: { value: '' } })
    jest.runAllTimers()
    wrapper.find('input').simulate('blur')
    jest.runAllTimers()
    expect(blurCb).toHaveBeenCalled()
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual(
      '请输入名称'
    )
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
        <FormItem label='名称' field='name'>
          <Input
            placeholder='name'
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
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual(
      '请输入名称'
    )
    wrapper.find('input').simulate('change', { target: { value: 'hiui' } })
    jest.runAllTimers()
    wrapper.instance().validate(cb)
    expect(wrapper.find('.hi-form-item--msg__error').text()).toEqual('')
    expect(() => wrapper.instance().validateField('errorField', cb)).toThrow()
    wrapper.unmount()

    jest.useRealTimers()
  })
  it('cancelSubmit resetValidates', () => {
    const wrapper = mount(<Demo />)
    expect(wrapper.find('.hi-form')).toHaveLength(1)
    wrapper
      .find('button')
      .at(0)
      .simulate('click')
    expect(wrapper.find('.hi-form-item--msg__error').find('span')).toHaveLength(
      1
    )
    wrapper
      .find('button')
      .at(1)
      .simulate('click')
    expect(wrapper.find('.hi-form-item--msg__error').find('span')).toHaveLength(
      0
    )
    wrapper.unmount()
  })
  it('validate When No item', () => {
    const wrapper = mount(<Demo2 />)
    expect(wrapper.find('.hi-form')).toHaveLength(1)
    wrapper
      .find('button')
      .at(0)
      .simulate('click')
    expect(wrapper.find('.hi-form-item--msg__error').find('span')).toHaveLength(
      0
    )
    wrapper.unmount()
  })
  it('validate When No rules', () => {
    const wrapper = mount(<Demo3 />)
    expect(wrapper.find('.hi-form')).toHaveLength(1)
    wrapper
      .find('button')
      .at(0)
      .simulate('click')
    expect(wrapper.find('.hi-form-item--msg__error').find('span')).toHaveLength(
      0
    )
    wrapper.unmount()
  })
})

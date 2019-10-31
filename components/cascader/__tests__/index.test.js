import React from 'react'
import { mount } from 'enzyme'
import sinon, { spy, stub } from 'sinon'
import CascaderProvider, { Cascader } from '../Cascader'
/* eslint-env jest */
describe('Cascader', () => {
  const data = [
    {
      content: '手机',
      id: '手机',
      children: [
        {
          content: '小米',
          id: '小米',
          children: [
            {
              content: '小米3',
              id: '小米3'
            },
            {
              content: '小米4',
              id: '小米4'
            }
          ]
        },
        {
          content: '红米',
          id: '红米',
          children: [
            {
              content: '红米3',
              id: '红米3',
              disabled: true
            },
            {
              content: '红米4',
              id: '红米4'
            }
          ]
        }
      ]
    },
    {
      content: '电视',
      id: '电视',
      children: [
        {
          content: '小米电视4A',
          id: '小米电视4A'
        },
        {
          content: '小米电视4C',
          id: '小米电视4C',
          disabled: true
        }
      ]
    }
  ]

  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })

  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const componentDidMountSpy = spy(Cascader.prototype, 'componentDidMount')
      const wrapper = mount(<CascaderProvider />)

      expect(wrapper.find(Cascader).instance()).toBeInstanceOf(Cascader)

      expect(componentDidMountSpy.callCount).toEqual(1)
      componentDidMountSpy.restore()

      expect(wrapper.find(`.hi-cascader`)).toHaveLength(1)
    })

    it('componentWillUnmount', () => {
      const componentWillUnmountSpy = spy(Cascader.prototype, 'componentWillUnmount')
      const wrapper = mount(<CascaderProvider />)

      wrapper.unmount()

      expect(componentWillUnmountSpy.callCount).toEqual(1)
      componentWillUnmountSpy.restore()

      expect(wrapper.find(`.hi-cascader`)).toHaveLength(0)
    })

    it('componentWillReceiveProps', () => {
      const componentWillReceivePropsSpy = spy(Cascader.prototype, 'componentWillReceiveProps')
      const wrapper = mount(<CascaderProvider />)

      wrapper.setProps({
        disabled: true
      })

      expect(componentWillReceivePropsSpy.callCount).toEqual(1)
      componentWillReceivePropsSpy.restore()
    })
  })

  describe('PropTypes', () => {
    it('data', () => {
      const wrapper = mount(<CascaderProvider {...{data}} />)

      expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(0)
      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(document.querySelectorAll('.hi-cascader__popper')).toHaveLength(1)

      wrapper.unmount()
    })

    it('value', () => {
      const value = ['手机', '红米', '红米4']
      const nextValue = ['电视', '电磁炉', '空调']
      const wrapper = mount(
        <CascaderProvider {...{data, value}} />
      )

      expect(wrapper.find(Cascader).state().cascaderValue).toEqual(value)

      wrapper.setProps({ value: nextValue })
      expect(wrapper.find(Cascader).state().cacheValue).toEqual(nextValue)
      expect(nextValue.join(' / ')).toEqual(
        expect.stringContaining(wrapper.find(Cascader).state().cascaderLabel)
      )
    })

    // NOTE 默认 fieldNames 与线上文档不一致
    it('fieldNames', () => {
      const fieldNames = {
        label: 'label',
        value: 'value',
        children: 'child'
      }
      const data = [
        {
          label: '电视',
          value: '电视',
          child: [
            {
              label: '小米电视4A',
              value: '小米电视4A'
            }
          ]
        }
      ]
      const wrapper = mount(
        <CascaderProvider {...{data, fieldNames}} />
      )

      expect(wrapper.find(Cascader).instance()).toBeInstanceOf(Cascader)
      expect(wrapper.find(Cascader).prop('data')).toMatchObject(data)
    })

    it('searchable', () => {
      const wrapper = mount(
        <CascaderProvider
          searchable
          {...{data}}
        />
      )

      expect(wrapper.find('input').prop('readOnly')).toEqual(false)

      wrapper.find('.hi-cascader__input-keyword').simulate('click')

      wrapper.find('input').simulate('change', { target: { value: 'empty' } })
      wrapper.find('input').simulate('keyUp')
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
      clock.tick(500)
      expect(document.querySelector('.hi-cascader-menu__item').textContent).toEqual('无匹配数据')

      wrapper.find('input').simulate('change', { target: { value: '电视' } })
      wrapper.find('input').simulate('keyUp')
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
      clock.tick(500)
      expect(document.querySelector('.hi-cascader-menu__item').textContent).toEqual(expect.stringContaining('电视'))

      wrapper.unmount()
    })

    it('filterOption', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <CascaderProvider
          data={data}
          searchable
          filterOption={callback}
        />
      )
      wrapper.find('input').simulate('change', { target: { value: 'a' } })
      wrapper.find('input').simulate('keyUp')
      clock.tick(500)
      expect(callback).toHaveBeenCalled()
    })

    it('clearable', () => {
      const wrapper = mount(
        <CascaderProvider
          clearable
          {...{data}}
        />
      )

      expect(wrapper.find('.hi-cascader--clearable')).toHaveLength(1)
      expect(wrapper.find('.hi-cascader__icon--clear')).toHaveLength(1)

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      document.querySelectorAll('.hi-cascader-menu')[0].children[0].click()
      document.querySelectorAll('.hi-cascader-menu')[1].children[0].click()
      document.querySelectorAll('.hi-cascader-menu')[2].children[0].click()
      wrapper.update()
      expect(wrapper.find('input').prop('value')).not.toEqual('')

      wrapper.find('.hi-cascader__icon--clear').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(false)

      wrapper.setProps({ clearable: false })

      expect(wrapper.find('.hi-cascader--clearable')).toHaveLength(0)
      expect(wrapper.find('.hi-cascader__icon--clear')).toHaveLength(0)

      wrapper.unmount()
    })

    it('disabled', () => {
      const wrapper = mount(
        <CascaderProvider
          disabled
          {...{data}}
        />
      )
      expect(wrapper.find('.hi-cascader--disabled')).toHaveLength(1)
      expect(wrapper.find('input').prop('disabled')).toEqual(true)

      wrapper.find('.hi-cascader__input-container').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(false)

      wrapper.unmount()
    })

    it('changeOnSelect', () => {
      const wrapper = mount(
        <CascaderProvider
          changeOnSelect
          {...{data}}
        />
      )
      let cascaderLabel = ''

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-cascader-menu')[0].children).toHaveLength(2)

      cascaderLabel = data[0].content
      document.querySelectorAll('.hi-cascader-menu')[0].children[0].click()
      wrapper.update()
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(2)
      expect(document.querySelectorAll('.hi-cascader-menu')[1].children).toHaveLength(2)
      expect(wrapper.find('input').prop('placeholder')).toEqual(cascaderLabel)
      wrapper.find(Cascader).setState({ popperShow: false })
      expect(wrapper.find('input').prop('value')).toEqual(cascaderLabel)
      wrapper.find(Cascader).setState({ popperShow: true })

      cascaderLabel = [data[0].content, data[0].children[0].content].join(' / ')
      document.querySelectorAll('.hi-cascader-menu')[1].children[0].click()
      wrapper.update()
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(3)
      expect(document.querySelectorAll('.hi-cascader-menu')[2].children).toHaveLength(2)
      expect(wrapper.find('input').prop('placeholder')).toEqual(cascaderLabel)
      wrapper.find(Cascader).setState({ popperShow: false })
      expect(wrapper.find('input').prop('value')).toEqual(cascaderLabel)
      wrapper.find(Cascader).setState({ popperShow: true })

      cascaderLabel = [data[0].content, data[0].children[0].content, data[0].children[0].children[0].content].join(' / ')
      document.querySelectorAll('.hi-cascader-menu')[2].children[0].click()
      wrapper.update()
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(3)
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(false)
      expect(wrapper.find('input').prop('value')).toEqual(cascaderLabel)

      wrapper.unmount()
    })

    it('className', () => {
      const className = 'custom-className'
      const wrapper = mount(
        <CascaderProvider {...{data, className}} />
      )

      expect(wrapper.find(`.hi-cascader.${className}`)).toHaveLength(1)
    })

    it('className', () => {
      const placeholder = 'custom-placeholder'
      const wrapper = mount(
        <CascaderProvider {...{data, placeholder}} />
      )

      expect(wrapper.find('input').prop('placeholder')).toEqual(placeholder)
    })

    // NOTE emptyContent 没有展示预期内容
    it.skip('emptyContent', () => {
      const emptyContent = 'custom-emptyContent'
      const wrapper = mount(
        <CascaderProvider {...{data, emptyContent}} />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(document.querySelectorAll('.hi-cascader-menu')[0].innerHTML).toEqual(expect.stringContaining(emptyContent))

      wrapper.unmount()
    })

    it('style', () => {
      const style = {
        color: '#ffff00'
      }
      const wrapper = mount(
        <CascaderProvider {...{data, style}} />
      )

      expect(wrapper.find(`.hi-cascader`).prop('style')).toMatchObject(style)
    })

    it('onActiveItemChange', () => {
      const onActiveItemChange = stub()
      const wrapper = mount(
        <CascaderProvider {...{data, onActiveItemChange}} />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      document.querySelectorAll('.hi-cascader-menu')[0].children[0].click()
      expect(onActiveItemChange.callCount).toEqual(1)

      document.querySelectorAll('.hi-cascader-menu')[1].children[0].click()
      expect(onActiveItemChange.callCount).toEqual(2)

      document.querySelectorAll('.hi-cascader-menu')[2].children[0].click()
      expect(onActiveItemChange.callCount).toEqual(2)

      onActiveItemChange.reset()
      wrapper.unmount()
    })

    it('onChange', () => {
      const onChange = stub()
      const wrapper = mount(
        <CascaderProvider {...{data, onChange}} />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      document.querySelectorAll('.hi-cascader-menu')[0].children[0].click()
      expect(onChange.callCount).toEqual(0)

      document.querySelectorAll('.hi-cascader-menu')[1].children[0].click()
      expect(onChange.callCount).toEqual(0)

      document.querySelectorAll('.hi-cascader-menu')[2].children[0].click()
      expect(onChange.callCount).toEqual(1)

      onChange.reset()
      wrapper.unmount()
    })

    it('displayRender', () => {
      const displayRender = stub()
      const returnValue = 'displayRender-return'
      displayRender.returns(returnValue)
      const wrapper = mount(
        <CascaderProvider {...{data, displayRender}} />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      document.querySelectorAll('.hi-cascader-menu')[0].children[0].click()
      document.querySelectorAll('.hi-cascader-menu')[1].children[0].click()
      document.querySelectorAll('.hi-cascader-menu')[2].children[0].click()
      wrapper.update()

      expect(wrapper.find('input').prop('value')).toEqual(returnValue)

      displayRender.reset()
      wrapper.unmount()
    })
  })

  describe('Branch', () => {
    it('state: { popperShow: true } && props: { disabled: false } && handleClick', () => {
      const wrapper = mount(
        <CascaderProvider disabled={false} {...{data}} />
      )

      wrapper.find('.hi-cascader__input-container').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(true)

      wrapper.find('.hi-cascader__input-container').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(false)

      wrapper.unmount()
    })

    it('state: { keyword：undefined }', () => {
      const wrapper = mount(
        <CascaderProvider
          searchable
          {...{data}}
        />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')

      wrapper.find('input').simulate('change', { target: { value: undefined } })
      wrapper.find('input').simulate('keyUp')
      expect(document.querySelectorAll('.hi-cascader-menu')).toHaveLength(1)
      clock.tick(500)
      expect(document.querySelector('.hi-cascader-menu__item').textContent).toEqual(data[0].content)

      wrapper.unmount()
    })

    it('clickOutside', () => {
      const outsideDom = document.createElement('div')
      const wrapper = mount(
        <CascaderProvider
          {...{data}}
        />
      )

      document.body.appendChild(outsideDom)

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(true)

      outsideDom.click()
      wrapper.update()
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(false)

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(true)

      document.querySelector('.hi-cascader-menu').click()
      expect(wrapper.find(Cascader).state('popperShow')).toEqual(true)

      outsideDom.remove()
      wrapper.unmount()
    })

    it('props: { data: [] }', () => {
      const data = []
      const wrapper = mount(
        <CascaderProvider
          {...{data}}
        />
      )

      wrapper.find('.hi-cascader__input-keyword').simulate('click')
      expect(document.querySelectorAll('.hi-cascader-menu__item')).toHaveLength(0)
    })
  })
})

import React from 'react'
import { mount } from 'enzyme'
import { fake } from 'sinon'
import Input, {Input as OriginalClass} from '../index'
/* eslint-env jest */
describe('Input', () => {
  describe('PropTypes', () => {
    it('id', () => {
      const wrapper = mount(
        <Input value='1' id='tId' />
      )
      expect(wrapper.find('.hi-input').prop('id')).toEqual('tId')
    })
    it('value', () => {
      const wrapper = mount(
        <Input value='1' />
      )
      expect(wrapper.find('.hi-input__text').prop('value')).toEqual('1')
      wrapper.setProps({value: '2'})
      expect(wrapper.find('.hi-input__text').prop('value')).toEqual('2')
      wrapper.setProps({value: '2'})
    })
    // it('defaultValue', () => {
    //   const wrapper = mount(
    //     <Input defaultValue='1' />
    //   )
    //   expect(wrapper.find('.hi-input__text').prop('value')).toEqual('1')
    //   wrapper.setProps({defaultValue: '2'})
    //   expect(wrapper.find('.hi-input__text').prop('value')).toEqual('1')
    // })
    it('type', () => {
      const types = ['text', 'id', 'tel', 'card', 'amount', 'email']
      const wrapper = mount(
        <div>
          {
            types.map((type, index) => {
              return <Input type={type} key={index} value='0' />
            })
          }
          <Input type='textarea' />
        </div>
      )
      types.map((type, index) => {
        expect(wrapper.find(`.${type}`)).toHaveLength(1)
      })
      expect(wrapper.find('textarea')).toHaveLength(1)
    })

    it('prepend&append', () => {
      const wrapper = mount(
        <Input prepend='prepend' append='append' />
      )
      const firstEl = wrapper.find('.hi-input__inner')
      expect(firstEl.childAt(0).hasClass('hi-input__prefix')).toBeTruthy()
      expect(firstEl.childAt(0).text()).toEqual('prepend')
      expect(firstEl.childAt(2).hasClass('hi-input__suffix')).toBeTruthy()
      expect(firstEl.childAt(2).text()).toEqual('append')

      wrapper.setProps({
        prepend: <button />,
        append: <button />
      })
      const secEl = wrapper.find('.hi-input__out')
      expect(secEl.childAt(0).hasClass('hi-input__prepend')).toBeTruthy()
      expect(secEl.childAt(2).hasClass('hi-input__append')).toBeTruthy()

      wrapper.setProps({
        prepend: 'a',
        append: 'a'
      })
      expect(firstEl.childAt(0).text()).toEqual('prepend')
      expect(firstEl.childAt(2).text()).toEqual('append')
    })
    it('input.disabled', () => {
      const wrapper = mount(
        <Input disabled />
      )
      expect(wrapper.find('.hi-input__inner').hasClass('disabled')).toBeTruthy()
      wrapper.setProps({disabled: false})
      expect(wrapper.find('.hi-input__inner').hasClass('disabled')).toBeFalsy()
    })
    it('textarea.disabled', () => {
      const wrapper = mount(
        <Input disabled type='textarea' />
      )
      expect(wrapper.find('textarea').hasClass('disabled')).toBeTruthy()
      wrapper.setProps({disabled: false})
      expect(wrapper.find('textarea').hasClass('disabled')).toBeFalsy()
    })
    it('clearable', () => {
      const callback = fake()
      const wrapper = mount(
        <Input value='1' clearable='true' onChange={callback} />
      )
      wrapper.find('.hi-input').first().simulate('mouseover')
      const clBtn = wrapper.find('.hi-input__fix-box')
      expect(clBtn).toHaveLength(1)
      expect(clBtn.hasClass('invisible')).toBeFalsy()
      clBtn.simulate('click')
      expect(callback.callCount).toEqual(1)
      expect(wrapper.find('.hi-input__text').prop('value')).toEqual('')
      wrapper.setProps({disabled: true})
      wrapper.find('.hi-input').first().simulate('mouseover')
      expect(wrapper.find('.hi-input__fix-box').hasClass('invisible')).toBeTruthy()
    })
    it('placeholder', () => {
      const wrapper = mount(
        <Input placeholder='请输入' />
      )
      expect(wrapper.find('.hi-input__text').prop('placeholder')).toEqual('请输入')
    })
  })
  describe('events', () => {
    it('onFocus', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Input onFocus={callback} />
          <Input type='textarea' onFocus={callback} />
        </div>
      )
      wrapper.find('.hi-input__text').simulate('focus')
      expect(callback.callCount).toEqual(1)
      wrapper.find('textarea').simulate('focus')
      expect(callback.callCount).toEqual(2)
    })
    it('onBlur', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Input onBlur={callback} />
          <Input type='textarea' onBlur={callback} />
        </div>
      )
      wrapper.find('.hi-input__text').simulate('blur')
      expect(callback.callCount).toEqual(1)
      wrapper.find('textarea').simulate('blur')
      expect(callback.callCount).toEqual(2)
    })
    it('onKeyDown&onKeyUp&onKeyPress', () => {
      const keyDownCallback = fake()
      const keyUpCallback = fake()
      const keyPressCallback = fake()
      const wrapper = mount(
        <div>
          <Input onKeyDown={keyDownCallback} onKeyUp={keyUpCallback} onKeyPress={keyPressCallback} />
          <Input type='textarea' onKeyDown={keyDownCallback} onKeyUp={keyUpCallback} onKeyPress={keyPressCallback} />
        </div>
      )
      wrapper.find('.hi-input__text').simulate('keydown')
      expect(keyDownCallback.callCount).toEqual(1)
      wrapper.find('.hi-input__text').simulate('keyup')
      expect(keyUpCallback.callCount).toEqual(1)
      wrapper.find('.hi-input__text').simulate('keypress')
      expect(keyPressCallback.callCount).toEqual(1)

      wrapper.find('textarea').simulate('keydown')
      expect(keyDownCallback.callCount).toEqual(2)
      wrapper.find('textarea').simulate('keyup')
      expect(keyUpCallback.callCount).toEqual(2)
      wrapper.find('textarea').simulate('keypress')
      expect(keyPressCallback.callCount).toEqual(2)
    })
    it('onInput', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Input onInput={callback} />
          <Input type='textarea' onInput={callback} />
        </div>
      )
      wrapper.find('.hi-input__text').simulate('input')
      expect(callback.callCount).toEqual(1)
      wrapper.find('textarea').simulate('input')
      expect(callback.callCount).toEqual(2)
    })
    it('onChange', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Input onChange={callback} prepend='a' append='a' />
          <Input type='textarea' onChange={callback} />
        </div>
      )
      wrapper.find('.hi-input__text').simulate('change')
      expect(callback.callCount).toEqual(1)
      wrapper.find('textarea').simulate('change')
      expect(callback.callCount).toEqual(2)
    })
  })

  describe('StatementsOrBranches', () => {
    it('onBlur.amount', () => {
      const callback = fake()
      const wrapper = mount(
        <Input onBlur={callback} type='amount' value='1' />
      )
      wrapper.find('.hi-input__text').simulate('blur')
      expect(callback.callCount).toEqual(1)
    })
    it('onChange.prefix&suffix', () => {
      const callback = fake()
      const wrapper = mount(
        <Input onChange={callback} />
      )
      wrapper.find('.hi-input__text').simulate('change')
      expect(callback.callCount).toEqual(1)
    })
    it('clear.prefix', () => {
      // const callback = fake()
      const wrapper = mount(
        <Input value='1' clearable='true' prefix='' suffix='' />
      )
      wrapper.find('.hi-input').first().simulate('mouseover')
      const clBtn = wrapper.find('.hi-input__fix-box')
      clBtn.simulate('click')
    })
    it('textarea.mouse', () => {
      const callback = fake()
      const wrapper = mount(
        <Input type='textarea' onChange={callback} />
      )
      wrapper.find('textarea').simulate('mouseover')
      console.log(wrapper.find(OriginalClass).debug())
      expect(wrapper.find(OriginalClass).state('hover')).toEqual(true)
      wrapper.find('textarea').simulate('mouseleave')
      expect(wrapper.find(OriginalClass).state('hover')).toEqual(false)
    })
    it('input.mouse', () => {
      const callback = fake()
      const wrapper = mount(
        <Input onChange={callback} />
      )
      wrapper.find('.hi-input').simulate('mouseover')
      expect(wrapper.find(OriginalClass).state('hover')).toEqual(true)
      wrapper.find('.hi-input').simulate('mouseleave')
      expect(wrapper.find(OriginalClass).state('hover')).toEqual(false)
    })
    it('noNeed', () => {
      const wrapper = mount(
        <Input size='small' required />
      )
      expect(wrapper.find('.hi-input_small')).toHaveLength(1)
      expect(wrapper.find('.required')).toHaveLength(1)
    })
  })

  describe('Input.Util', () => {
    it('formatId', () => {
      // value='110000 0000 0000 0000'
      const wrapper = mount(
        <Input type='id' value='110' />
      )
      const origin = wrapper.find(OriginalClass)
      expect(origin.state('value')).toEqual('110')
      wrapper.setProps({value: '1100000'})
      expect(origin.state('value')).toEqual('110000 0')
      wrapper.setProps({value: '11000000000'})
      expect(origin.state('value')).toEqual('110000 0000 0')
      wrapper.setProps({value: '110000000000000000'})
      expect(origin.state('value')).toEqual('110000 0000 0000 0000')
      wrapper.find('.hi-input__text').simulate('change')
    })
    it('formatTel', () => {
      // value='130 000 00000'
      const wrapper = mount(
        <Input type='tel' value='a' />
      )
      const origin = wrapper.find(OriginalClass)
      expect(origin.state('value')).toEqual('')
      wrapper.setProps({value: '130'})
      expect(origin.state('value')).toEqual('130')
      wrapper.setProps({value: '1300000'})
      expect(origin.state('value')).toEqual('130 0000')
      wrapper.setProps({value: '13000000000'})
      expect(origin.state('value')).toEqual('130 0000 0000')
      wrapper.find('.hi-input__text').simulate('change')
    })
    it('formatCard', () => {
      // value='0000 0000 0000 0000 000'
      const wrapper = mount(
        <Input type='card' value='a' />
      )
      const origin = wrapper.find(OriginalClass)
      expect(origin.state('value')).toEqual('')
      wrapper.setProps({value: '0000'})
      expect(origin.state('value')).toEqual('0000')
      wrapper.setProps({value: '00000000'})
      expect(origin.state('value')).toEqual('0000 0000')
      wrapper.setProps({value: '000000000000'})
      expect(origin.state('value')).toEqual('0000 0000 0000')
      wrapper.setProps({value: '0000000000000000'})
      expect(origin.state('value')).toEqual('0000 0000 0000 0000')
      wrapper.setProps({value: '0000000000000000000'})
      expect(origin.state('value')).toEqual('0000 0000 0000 0000 000')
      wrapper.find('.hi-input__text').simulate('change')
    })

    it('format.amount', () => {
      const wrapper = mount(
        <Input type='amount' value='0' />
      )
      const origin = wrapper.find(OriginalClass)
      expect(origin.state('value')).toEqual('0')
      wrapper.setProps({value: '0.0.0'})
      expect(origin.state('value')).toEqual('0.0')
      wrapper.find('.hi-input__text').simulate('change')
      wrapper.setProps({value: '0'})
      wrapper.find('.hi-input__text').simulate('blur')
      expect(origin.state('value')).toEqual('0.00')
      wrapper.setProps({value: '0.0'})
      wrapper.find('.hi-input__text').simulate('blur')
      expect(origin.state('value')).toEqual('0.0')
    })
  })
})

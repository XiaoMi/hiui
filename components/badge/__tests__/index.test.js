import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Badge from '../Badge'

describe('Badge', () => {
  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const wrapper = mount(<Badge />)

      expect(wrapper.instance()).toBeInstanceOf(Badge)

      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-base`)).toHaveLength(1)
      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-value`)).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    it('type', () => {
      const wrapper = mount(
        <div>
          <Badge type='bubble' />
          <Badge type='dot' />
        </div>
      )

      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-dot`)).toHaveLength(1)
      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-value`)).toHaveLength(1)
    })

    it('content', () => {
      const content = 'test-content'
      const contentNumber1 = 1
      const contentNumber2 = 100
      const wrapper = shallow(
        <Badge {...{content}} />
      )

      expect(wrapper.text()).toEqual(expect.stringMatching(content))

      wrapper.setProps({ content: contentNumber1 })
      expect(wrapper.text()).toEqual(expect.stringMatching(`${contentNumber1}`))

      wrapper.setProps({ content: contentNumber2 })
      expect(wrapper.text()).toEqual(expect.stringMatching(`${Badge.defaultProps.max}+`))
    })

    it('max', () => {
      const props = {
        max: 33,
        content: 1
      }
      const wrapper = shallow(
        <Badge {...props} />
      )

      expect(wrapper.text()).toEqual(expect.stringMatching(`${props.content}`))

      wrapper.setProps({ content: 34 })
      expect(wrapper.text()).toEqual(expect.stringMatching(`${props.max}+`))
    })

    it('visible', () => {
      const wrapper = mount(
        <div>
          <Badge type='bubble' visible={false} />
          <Badge type='dot' visible={false} />
        </div>
      )

      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-dot.hi-hide`)).toHaveLength(1)
      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-value.hi-hide`)).toHaveLength(1)
    })

    it('style', () => {
      const style = {
        color: '#ffff00'
      }
      const wrapper = shallow(
        <Badge {...{style}} />
      )

      expect(wrapper.find(`.${Badge.defaultProps.prefixCls}-base`).prop('style')).toMatchObject(style)
    })
  })
})

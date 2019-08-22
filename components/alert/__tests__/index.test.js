import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Alert from '../alert'

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const componentDidMountSpy = spy(Alert.prototype, 'componentDidMount')
      const wrapper = mount(<Alert />)

      expect(wrapper.instance()).toBeInstanceOf(Alert)

      expect(componentDidMountSpy.callCount).toEqual(1)
      componentDidMountSpy.restore()

      expect(wrapper.find('.icon-info-circle-o')).toHaveLength(1)
      expect(wrapper.find('.close-btn')).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    it('type', () => {
      const wrapper = mount(
        <div>
          <Alert type='info' />
          <Alert type='error' />
          <Alert type='success' />
          <Alert type='warning' />
        </div>
      )

      // NOTE 缺少 type 对应唯一标识
      expect(wrapper.find('.icon-info-circle-o')).toHaveLength(2)
      expect(wrapper.find('.icon-close-circle-o')).toHaveLength(1)
      expect(wrapper.find('.icon-check-circle-o')).toHaveLength(1)
    })

    it('onClose', () => {
      const callback = fake()
      const wrapper = shallow(
        <Alert onClose={callback} />
      )

      wrapper.find('.close-btn').first().simulate('click')
      expect(callback.callCount).toEqual(1)
    })

    it('content', () => {
      const content = 'text-content'
      const wrapper = shallow(
        <Alert {...{content}} />
      )

      expect(wrapper.text()).toEqual(expect.stringMatching(content))
    })

    it('title', () => {
      const title = 'text-title'
      const wrapper = shallow(
        <Alert {...{title}} />
      )

      expect(wrapper.text()).toEqual(expect.stringMatching(title))
    })

    it('duration', () => {
      const duration = 100
      const wrapper = shallow(
        <Alert {...{duration}} />
      )
      const handleCloseSpy = spy(Alert.prototype, 'handleClose')

      expect(handleCloseSpy.callCount).toEqual(0)
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), duration)

      jest.runAllTimers()
      expect(handleCloseSpy.callCount).toEqual(1)
      handleCloseSpy.restore()
    })
  })
})

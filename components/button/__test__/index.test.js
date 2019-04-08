import React from 'react'
import { mount } from 'enzyme'
import Button from '../'

let wrapper
const clickCallback = jest.fn(val => val)

describe('Dropdown', () => {
  beforeEach(() => {})

  afterEach(() => {
    wrapper && wrapper.unmount()
    clickCallback.mockClear()
  })

  it('点击事件', () => {
    wrapper = mount(
      <div>
        <Button onClick={clickCallback} type="primary">突出按钮</Button>
      </div>
    )

    wrapper.find(Button).simulate('click')

    expect(clickCallback).toHaveBeenCalled()
  })
})

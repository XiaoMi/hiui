import React from 'react'
import { mount, shallow } from 'enzyme'
import sinon, { spy, stub } from 'sinon'
import Table from '../'

describe('Table', () => {
  const dataLength = 10
  const columns = [
    { title: 'Column 1', dataIndex: 'name', key: '1'},
    { title: 'Column 1', dataIndex: 'age', key: '2'},
    { title: 'Column 1', dataIndex: 'address', key: '3'},
    {
      title: ()=><div>自定义标题</div>,
      dataIndex: 'address', key: '4',
      width: '500px',
      render(text,record,index){
      return (
        <div>
          {text} --- {index} --- 自定义渲染
        </div>
      )
    }},
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: () => <a href="javascript:;">action</a>,
    },
  ]
  const generateData = (length) => {
    const data = []
    for (let i = 0; i < dataLength; i++) {
      data.push({
        // key: i,
        name: `Don Diablo ${i}`,
        age: `${i}${i}`,
        address: `EDC Las Vegas no. ${i}`,
      })
    }
    return data
  }

  const data = generateData(dataLength)

  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })

  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const componentDidMountSpy = spy(Table.prototype, 'componentDidMount')
      const wrapper = mount(<Table />)

      expect(wrapper.instance()).toBeInstanceOf(Table)

      expect(componentDidMountSpy.callCount).toEqual(1)
      componentDidMountSpy.restore()

      expect(wrapper.find(`.hi-table`)).toHaveLength(1)
    })

    it('shouldComponentUpdate', () => {
      const shouldComponentUpdateSpy = spy(Table.prototype, 'shouldComponentUpdate')
      const wrapper = mount(<Table />)

      // runMemory() in componentDidmount() and setState()
      expect(shouldComponentUpdateSpy.callCount).toEqual(1)
      shouldComponentUpdateSpy.restore()
    })

    it('componentDidUpdate', () => {
      const componentDidUpdateSpy = spy(Table.prototype, 'componentDidUpdate')
      const wrapper = mount(<Table />)

      // runMemory() in componentDidmount() and setState()
      expect(componentDidUpdateSpy.callCount).toEqual(1)
      componentDidUpdateSpy.restore()
    })

    it('componentWillReceiveProps', () => {
      const componentWillReceivePropsSpy = spy(Table.prototype, 'componentWillReceiveProps')
      const wrapper = mount(<Table />)

      wrapper.setProps({ data: [] })
      expect(componentWillReceivePropsSpy.callCount).toEqual(1)
      componentWillReceivePropsSpy.restore()
    })
  })

  describe('PropTypes', () => {
    it('data', () => {
      const wrapper = mount(<Table {...{data}} />)

      expect(wrapper.find(`Row`)).toHaveLength(dataLength)
    })

    it('columns', () => {
      const wrapper = mount(<Table {...{columns}} />)

      expect(wrapper.find(`.hi-table-thead`)).toHaveLength(1)
    })

    it('style', () => {
      const style = {
        color: '#ffff00'
      }
      const wrapper = mount(<Table {...{style}} />)

      expect(wrapper.find(`TableContent`).prop('style')).toMatchObject(style)
    })
  })
})

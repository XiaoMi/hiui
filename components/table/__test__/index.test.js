import React from 'react'
import { mount } from 'enzyme'
import Table from '../index'

let wrapper
const changeCallback = jest.fn(items => items)
const successCallback = jest.fn(res => res.data)
const errorCallback = jest.fn(err => err)
jest.mock('lodash/debounce', () => jest.fn(fn => fn))

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '姓名'
  },
  {
    key: 'age',
    dataIndex: 'age',
    title: '年龄'
  },
  {
    key: 'sex',
    dataIndex: 'sex',
    title: '性别'
  }
]

const data = [

]

for (let i=0; i<10; i++) {
  data.push({
    name: `siri${i}`,
    age: i,
    sex: i%2 === 0 ? 'boy' : 'girl'
  })
}

describe('Table', () => {

  let random = Math.floor(Math.random())
  it('base', () => {
    wrapper = mount(
      <Table
        columns={columns}
        data={data}
      />
    )
    expect(wrapper.find('table tbody tr').at(random).find('td').at(0).text()).toEqual(data[random].name)
  })

  it('sort', () => {
    let sorterColumns = [...columns]
    sorterColumns[1].sorter = function() {
      return pre.age - next.age
    }
    wrapper = mount(
      <Table
        columns={sorterColumns}
        data={data}
      />
    )
    expect(wrapper.find('table tbody tr').at(random).find('td').at(0).text()).toEqual(data[random].name)
    wrapper.find('table thead tr th').at(1).find('div span').at(1).simulate('click')
    expect(wrapper.find('table tbody tr').at(random).find('td').at(0).text()).toEqual(data[9-random].name)
  })
})

import React from 'react'
import { HiBaseSizeEnum } from '@hi-ui/core'
import Provider from '../src'
import { Row, Col } from '@hi-ui/grid'
import Radio from '@hi-ui/radio'
import Button from '@hi-ui/button'
import Select from '@hi-ui/select'
import Input from '@hi-ui/input'
import DatePicker from '@hi-ui/date-picker'
import Upload from '@hi-ui/upload'
import Table from '@hi-ui/table'
import Alert from '@hi-ui/alert'
import Collapse from '@hi-ui/collapse'
import Counter from '@hi-ui/counter'
import Pagination from '@hi-ui/pagination'

/**
 * @title 设置尺寸
 */
export const Size = () => {
  const [size, setSize] = React.useState<HiBaseSizeEnum>('md')

  return (
    <>
      <h1>设置尺寸</h1>
      <div className="provider-size__wrap">
        <Provider size={size}>
          <Radio.Group
            style={{ width: 240, marginBottom: 24 }}
            data={[
              {
                id: HiBaseSizeEnum.XS,
                title: '超小',
              },
              {
                id: HiBaseSizeEnum.SM,
                title: '小',
              },
              {
                id: HiBaseSizeEnum.MD,
                title: '中',
              },
              {
                id: HiBaseSizeEnum.LG,
                title: '大',
              },
            ]}
            value={size}
            onChange={(val) => setSize(val as HiBaseSizeEnum)}
          />
          <Row gutter={12}>
            <Col>
              <Button>按钮</Button>
            </Col>
            <Col>
              <Input />
            </Col>
            <Col>
              <Select data={[]} />
            </Col>
            <Col>
              <DatePicker />
            </Col>
            <Col>
              <Upload />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Alert title="信息提示内容" />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Collapse arrowPlacement="left">
                <Collapse.Panel title="小米 AI" id="4">
                  <div
                    style={{
                      backgroundColor: '#f5f7fa',
                      textAlign: 'center',
                      padding: 32,
                      color: '#1f2733',
                    }}
                  >
                    我是小米 AI 的内容
                  </div>
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Counter />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col>
              <Table
                columns={[
                  {
                    title: '商品名',
                    dataKey: 'name',
                    render: (text, row) => {
                      console.log(text, row)
                      return text + '*'
                    },
                  },
                  {
                    title: '品类',
                    dataKey: 'type',
                  },
                  {
                    title: '规格',
                    dataKey: 'size',
                  },
                  {
                    title: '单价',
                    dataKey: 'price',
                  },
                  {
                    title: '门店',
                    dataKey: 'address',
                  },
                  {
                    title: '库存',
                    dataKey: 'stock',
                  },
                ]}
                data={[
                  {
                    name: '小米9',
                    type: '手机',
                    size: '6G+64G',
                    price: '3299.00',
                    address: '华润五彩城店',
                    stock: '29,000',
                    key: 1,
                  },
                  {
                    name: '小米9 SE',
                    type: '手机',
                    size: '6G+64G 幻彩蓝',
                    price: '1999.00',
                    address: '清河店',
                    stock: '10,000',
                    key: 2,
                  },
                  {
                    name: '小米8',
                    type: '手机',
                    size: '6G+64G 幻彩蓝',
                    price: '2599.00',
                    address: '双安店',
                    stock: '12,000',
                    key: 3,
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col>
              <Pagination pageSize={10} total={50} showJumper pageSizeOptions={[10, 20, 50, 100]} />
            </Col>
          </Row>
        </Provider>
      </div>
    </>
  )
}

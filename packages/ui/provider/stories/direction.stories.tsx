import React from 'react'
import Provider from '../src'
import { Row, Col } from '@hi-ui/grid'
import Radio from '@hi-ui/radio'
import Select from '@hi-ui/select'
import CheckCascader from '@hi-ui/check-cascader'
import CheckTreeSelect from '@hi-ui/check-tree-select'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button'
import Upload from '@hi-ui/upload'
import Table from '@hi-ui/table'
import Alert from '@hi-ui/alert'
import Pagination from '@hi-ui/pagination'
import Drawer from '@hi-ui/drawer'

/**
 * @title 设置方向
 */
export const Direction = () => {
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr')
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>设置方向</h1>
      <div className="provider-direction__wrap">
        <Radio.Group
          style={{ width: 240, marginBottom: 24 }}
          data={[
            {
              id: 'ltr',
              title: 'LTR',
            },
            {
              id: 'rtl',
              title: 'RTL',
            },
          ]}
          value={direction}
          onChange={(val) => setDirection(val as 'ltr' | 'rtl')}
        />
        <div style={{ direction }}>
          <Provider direction={direction}>
            <Row gutter={12}>
              <Col span={6}>
                <Select
                  overlay={{ disabledPortal: true }}
                  placeholder="Select"
                  data={[
                    { title: '手机', id: 'shouji' },
                    { title: '电脑', id: 'diannao' },
                    { title: '电视', id: 'dianshi' },
                    { title: '洗衣机', id: 'xiyiji' },
                    { title: '冰箱', id: 'bingxiang' },
                    { title: '空调', id: 'kongtiao' },
                    { title: '汽车', id: 'qiche' },
                  ]}
                />
              </Col>
              <Col span={6}>
                <CheckCascader
                  overlay={{
                    disabledPortal: true,
                  }}
                  searchable={false}
                  placeholder="CheckCascader"
                  changeOnSelect
                  data={[
                    {
                      id: '手机',
                      title: '手机t',
                      children: [
                        {
                          id: '小米',
                          title: '小米t',
                          children: [
                            {
                              id: '小米3',
                              title: '小米3t',
                            },
                            {
                              id: '小米4',
                              title: '小米4t',
                            },
                          ],
                        },
                        {
                          id: '红米',
                          title: '红米t',
                          children: [
                            {
                              id: '红米3',
                              title: '红米3t',
                            },
                            {
                              id: '红米4',
                              title: '红米4t',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: '电视',
                      title: '电视t',
                      children: [
                        {
                          id: '小米电视4A',
                          title: '小米电视4At',
                        },
                        {
                          id: '小米电视4C',
                          title: '小米电视4Ct',
                        },
                      ],
                    },
                  ]}
                />
              </Col>
              <Col span={6}>
                <CheckTreeSelect
                  overlay={{ disabledPortal: true }}
                  placeholder="CheckTreeSelect"
                  data={[
                    {
                      title: '手机类',
                      id: '0',
                      children: [
                        {
                          title: 'Redmi系列',
                          id: '0-0',
                          disabled: true,
                          children: [
                            {
                              id: '0-0-1',
                              title: 'Redmi K30',
                            },
                            {
                              id: '0-0-2',
                              title: 'Redmi K30 Pro',
                            },
                            {
                              id: '0-0-3',
                              title: 'Redmi 10X 5G',
                            },
                            {
                              id: '0-0-4',
                              title: 'Redmi Note 8',
                            },
                            {
                              id: '0-0-5',
                              title: 'Redmi 9',
                            },
                            {
                              id: '0-0-6',
                              title: 'Redmi 9A',
                            },
                          ],
                        },
                        {
                          title: '小米手机',
                          id: '0-1',
                          children: [
                            {
                              id: '0-1-1',
                              title: '小米10 Pro',
                            },
                            {
                              id: '0-1-2',
                              title: '小米10',
                            },
                            {
                              id: '0-1-3',
                              title: '小米10 青春版 5G',
                            },
                            {
                              id: '0-1-4',
                              title: '小米MIX Alpha',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      title: '电视',
                      id: '1',
                      children: [
                        {
                          title: '小米电视 大师 65英寸OLED',
                          id: '1-0',
                        },
                        {
                          title: 'Redmi 智能电视 MAX 98',
                          id: '1-1',
                        },
                        {
                          title: '小米电视4A 60英寸',
                          id: '1-2',
                        },
                      ],
                    },
                  ]}
                />
              </Col>
              <Col span={6}>
                <DatePicker overlay={{ disabledPortal: true }} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={() => setVisible(!visible)}>Drawer</Button>
                <Drawer
                  title="抽屉标题"
                  visible={visible}
                  unmountOnClose
                  onClose={() => setVisible(false)}
                  footer={
                    <div style={{ textAlign: 'right' }}>
                      <Button
                        type="default"
                        appearance="line"
                        key={1}
                        onClick={() => setVisible(false)}
                      >
                        取消
                      </Button>
                      <Button type="primary" key={0} onClick={() => setVisible(false)}>
                        确认
                      </Button>
                    </div>
                  }
                >
                  <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
                </Drawer>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Upload
                  defaultFileList={[
                    {
                      name: 'a.png',
                      fileId: '1',
                      fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
                      uploadState: 'loading', // 上传状态，可取值success, error
                      progressNumber: 50,
                      url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
                    },
                    {
                      name: 'b.png',
                      fileId: '2',
                      fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
                      uploadState: 'success', // 上传状态，可取值success, error
                      url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
                    },
                    {
                      name: 'c.png',
                      fileId: '3',
                      fileType: 'img',
                      uploadState: 'error',
                      url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Alert title="信息提示内容" />
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
                <Pagination
                  pageSize={10}
                  total={50}
                  showJumper
                  pageSizeOptions={[10, 20, 50, 100]}
                />
              </Col>
            </Row>
          </Provider>
        </div>
      </div>
    </>
  )
}

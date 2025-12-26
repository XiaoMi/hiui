import React from 'react'
import Provider, { ThemeDataProps } from '../src'
import { Row, Col } from '@hi-ui/grid'
import Pagination from '@hi-ui/pagination'
import Button from '@hi-ui/button'
import Upload from '@hi-ui/upload'
import Radio from '@hi-ui/radio'
import CheckSelect from '@hi-ui/check-select'
import Alert from '@hi-ui/alert'
import Input from '@hi-ui/input'
import Select from '@hi-ui/select'
import DatePicker from '@hi-ui/date-picker'
import Stepper from '@hi-ui/stepper'
import Slider from '@hi-ui/slider'
import Switch from '@hi-ui/switch'
import Checkbox from '@hi-ui/checkbox'
import Table from '@hi-ui/table'

Provider.config({ prefixCls: 'yun-test' })

/**
 * @title 自定义样式前缀
 * @desc 该方式主要是解决样式冲突问题，不适用于动态改变样式前缀，需要全局配置一次。
 */
export const CustomPrefixCls = () => {
  const [theme, setTheme] = React.useState('default')

  const customTheme: ThemeDataProps = {
    token: {
      color: {
        primary: {
          50: '#eaf3fa',
          100: '#cde2f5',
          200: '#9fcaeb',
          300: '#73b2e0',
          400: '#4899d6',
          // 主要颜色
          500: '#1d81cc',
          600: '#176ba8',
          700: '#125585',
          800: '#0e4061',
          900: '#09293c',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        danger: {
          50: '#ffeaea',
          100: '#ffbaba',
          200: '#ff8a8a',
          300: '#ff5959',
          400: '#ff2929',
          500: '#e60000',
          600: '#b80000',
          700: '#8a0000',
          800: '#5c0000',
          900: '#2e0000',
        },
        success: {
          50: '#e6f9eb',
          100: '#c6f0d4',
          200: '#93e0b5',
          300: '#52c483',
          400: '#21a35d',
          500: '#008046',
          600: '#006639',
          700: '#004d2c',
          800: '#00331e',
          900: '#001a0f',
        },
      },
      border: {
        size: {
          normal: '1px solid',
          semibold: '2px solid',
          bold: '4px solid',
        },
        radius: {
          sm: '4px',
          md: '6px',
          lg: '8px',
        },
      },
      height: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
      },
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
        '8': '8px',
      },
      text: {
        size: {
          xxl: '24px',
          xl: '18px',
          lg: '16px',
          md: '14px',
          sm: '12px',
        },
        lineheight: {
          xxl: '32px',
          xl: '26px',
          lg: '24px',
          md: '22px',
          sm: '20px',
        },
      },
    },
    components: {
      button: {
        border: {
          size: {
            none: 0,
            normal: '1px dashed',
            semibold: '2px dashed',
            bold: '4px dashed',
          },
        },
      },
    },
  }

  return (
    <>
      <h1>定制样式前缀</h1>
      <div className="provider-custom-prefix-cls__wrap">
        <Provider theme={theme === 'default' ? undefined : customTheme}>
          <div style={{ marginBottom: 24 }}>
            <Radio.Group
              data={[
                {
                  id: 'default',
                  title: '默认主题',
                },
                {
                  id: 'customized',
                  title: '定制主题',
                },
              ]}
              value={theme}
              onChange={(value) => setTheme(value as string)}
            />
          </div>

          {/* <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Button type="primary" appearance="solid">
                    Solid
                  </Button>
                  <Button type="default" appearance="solid">
                    Solid
                  </Button>
                  <Button type="danger" appearance="solid">
                    Solid
                  </Button>
                  <Button type="success" appearance="solid">
                    Solid
                  </Button>
                </Col>
                <Col span={24}>
                  <Button type="primary" appearance="filled">
                    Filled
                  </Button>
                  <Button type="default" appearance="filled">
                    Filled
                  </Button>
                  <Button type="danger" appearance="filled">
                    Filled
                  </Button>
                  <Button type="success" appearance="filled">
                    Filled
                  </Button>
                </Col>
                <Col span={24}>
                  <Button type="primary" appearance="line">
                    Line
                  </Button>
                  <Button type="default" appearance="line">
                    Line
                  </Button>
                  <Button type="danger" appearance="line">
                    Line
                  </Button>
                  <Button type="success" appearance="line">
                    Line
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Upload
                size="xs"
                uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
                tips="仅支持 jpg/png 文件，且不超过 500kb"
                accept="image/png,image/jpg"
                defaultFileList={[
                  {
                    name: 'a.png',
                    fileId: '1',
                    fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
                    uploadState: 'loading', // 上传状态，可取值success, error
                    progressNumber: 50,
                    size: 1435417,
                    url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
                  },
                  {
                    name: 'b.png',
                    fileId: '2',
                    fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
                    uploadState: 'success', // 上传状态，可取值success, error
                    size: 1435417,
                    url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
                  },
                  {
                    name: 'c.png',
                    fileId: '3',
                    fileType: 'img',
                    uploadState: 'error',
                    size: 1435417,
                    url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
                  },
                ]}
              />
            </Col>
          </Row> */}

          <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Alert type="primary" title="信息提示的文案" />
            </Col>
            <Col span={6}>
              <Alert type="success" title="信息提示的文案" />
            </Col>
            <Col span={6}>
              <Alert type="danger" title="信息提示的文案" />
            </Col>
            <Col span={6}>
              <Alert type="warning" title="信息提示的文案" />
            </Col>
          </Row>

          {/* <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Input />
            </Col>
            <Col span={6}>
              <Select
                data={[
                  { title: '手机', id: 'shouji' },
                  { title: '电脑', id: 'diannao' },
                  { title: '电视', id: 'dianshi' },
                ]}
              />
            </Col>
            <Col span={6}>
              <CheckSelect
                data={[
                  { title: '手机', id: 'shouji' },
                  { title: '电脑', id: 'diannao' },
                  { title: '电视', id: 'dianshi' },
                ]}
              />
            </Col>
            <Col span={6}>
              <DatePicker />
            </Col>
          </Row>

          <Row gutter={12} align="center" style={{ marginBottom: 24 }}>
            <Col span={3}>
              <Radio>单选框</Radio>
            </Col>
            <Col span={3}>
              <Checkbox>复选框</Checkbox>
            </Col>
            <Col span={3}>
              <Switch />
            </Col>
            <Col span={14}>
              <Slider />
            </Col>
          </Row>

          <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Stepper
                data={[
                  {
                    title: '账号信息',
                  },
                  {
                    title: '邮箱激活',
                  },
                  {
                    title: '信息登记',
                  },
                ]}
                current={2}
              />
            </Col>
          </Row>

          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col>
              <Table
                columns={[
                  {
                    title: '商品名',
                    dataKey: 'name',
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

          <Pagination
            style={{ marginBottom: 24 }}
            total={200}
            pageSize={10}
            showTotal
            showJumper
            pageSizeOptions={[10, 20, 50, 100]}
          /> */}
        </Provider>
      </div>
    </>
  )
}

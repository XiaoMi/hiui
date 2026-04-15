# Provider provider

内容提供者。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Provider, { DesignSystemAccentColorEnum } from '@hi-ui/provider'
import { LocaleEnum } from '@hi-ui/locale-context'
import Pagination from '@hi-ui/pagination'
import Select from '@hi-ui/select'
import { Row, Col } from '@hi-ui/grid'
import Alert from '@hi-ui/alert' 
export const Basic = () => {
 const [locale, setLocale] = React.useState<LocaleEnum>()
 const [accentColor, setAccentColor] = React.useState<DesignSystemAccentColorEnum>()

 return (
 <> 
 <div className="provider-basic__wrap">
 <Alert title="在 APP 最外层包裹使用，用于主色、国际化、圆角、边框、特效等主题设置"></Alert>
 <Provider locale={locale} accentColor={accentColor} theme={{}}>
 <Row gutter style={{ marginTop: 20, marginBottom: 20 }}>
 <Col span={6}>
 <Select
 placeholder="语言"
 data={[
 {
 id: 'zh-CN',
 title: '简体中文',
 },
 {
 id: 'zh-TW',
 title: '繁体中文',
 },
 {
 id: 'en-US',
 title: 'English',
 },
 ]}
 value={locale}
 onChange={(val) => setLocale(val as LocaleEnum)}
 />
 </Col>
 <Col span={6}>
 <Select
 placeholder="配色"
 data={[
 {
 id: 'brandblue',
 title: '品牌蓝',
 },
 {
 id: 'ultramarine',
 title: '深蓝',
 },
 {
 id: 'pastelblue',
 title: '浅蓝',
 },
 {
 id: 'skyblue',
 title: '天空蓝',
 },
 {
 id: 'orange',
 title: '活力橙',
 },
 {
 id: 'amber',
 title: '琥珀',
 },
 {
 id: 'purple',
 title: '紫罗兰',
 },
 {
 id: 'cyan',
 title: '橘青',
 },
 ]}
 value={accentColor}
 onChange={(val) => setAccentColor(val as DesignSystemAccentColorEnum)}
 />
 </Col>
 </Row>
 <Pagination
 total={200}
 pageSize={10}
 showTotal
 showJumper
 pageSizeOptions={[10, 20, 50, 100]}
 />
 </Provider>
 </div>
 </>
 )
}

```


### 主题定制

支持全局 Token 和组件 Token 的定制


```tsx
import React from 'react'
import Provider, { ThemeDataProps } from '@hi-ui/provider'
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
export const Theme = () => {
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
 <div className="provider-basic__wrap">
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

 <Row gutter={12} style={{ marginBottom: 24 }}>
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
 </Row>

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

 <Row gutter={12} style={{ marginBottom: 24 }}>
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
 <DatePicker
 onChange={(date) => console.log(date)}
 showTime={true}
 value={new Date()}
 />
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
 />
 </Provider>
 </div>
 </>
 )
}

```


### 设置 portal

通过 Provider 设置 portal，可以将 Drawer、Modal 等组件的弹出层渲染在特定的 DOM 节点下


```tsx
import React from 'react'
import Provider from '@hi-ui/provider'
import Button from '@hi-ui/button'
import Drawer from '@hi-ui/drawer'
import Modal from '@hi-ui/modal'
import Space from '@hi-ui/space'
import { createMessage } from '@hi-ui/message'
import { createNotification } from '@hi-ui/notification' 
export const Portal = () => {
 const [drawerVisible, setDrawerVisible] = React.useState(false)
 const [modalVisible, setModalVisible] = React.useState(false)
 const [container, setContainer] = React.useState<HTMLElement | null>(null)

 const messageRef = React.useRef<ReturnType<typeof createMessage> | null>(null)
 const notificationRef = React.useRef<ReturnType<typeof createNotification> | null>(null)

 React.useEffect(() => {
 if (!container) {
 messageRef.current = createMessage()
 notificationRef.current = createNotification()
 } else {
 messageRef.current = createMessage({ container })
 notificationRef.current = createNotification({ container })
 }
 }, [container])

 return (
 <> 
 <div className="provider-portal__wrap">
 <Provider portal={{ container }}>
 <Space style={{ marginBottom: 12 }}>
 <Button type="secondary" onClick={() => setDrawerVisible(!drawerVisible)}>
 Drawer
 </Button>
 <Button type="secondary" onClick={() => setModalVisible(!modalVisible)}>
 Modal
 </Button>
 <Button
 type="secondary"
 onClick={() => {
 messageRef.current?.open({
 title: '欢迎使用 HiUI 组件库',
 type: 'success',
 })
 }}
 >
 Message
 </Button>
 <Button
 type="secondary"
 onClick={() => {
 notificationRef.current?.open({
 size: 'sm',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护！',
 })
 }}
 >
 Notification
 </Button>
 </Space>
 {/* 必须设置一个拥有定位的父元素，组件显示在该元素内 */}
 <div
 ref={setContainer}
 className="drawer-container__wrap"
 style={{
 width: '100%',
 minWidth: 660,
 height: 420,
 background: '#f5f7fa',
 boxShadow: '1px 2px 8px #ddd',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',

 // Need add for it
 position: 'relative',
 overflow: 'hidden',
 zIndex: 0,
 }}
 >
 <Drawer
 title="抽屉标题"
 style={{ position: 'absolute' }}
 visible={drawerVisible}
 closeable={false}
 onClose={() => setDrawerVisible(false)}
 >
 我是一段文字，也可以是表单、表格、步骤条等等
 </Drawer>
 <Modal
 title="提示"
 style={{ position: 'absolute' }}
 visible={modalVisible}
 closeable={false}
 onCancel={() => setModalVisible(false)}
 >
 我是挂载指定容器的模态框内容
 </Modal>
 </div>
 </Provider>
 </div>
 </>
 )
}

```


### 设置尺寸


```tsx
import React from 'react'
import { HiBaseSizeEnum } from '@hi-ui/core'
import Provider from '@hi-ui/provider'
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
export const Size = () => {
 const [size, setSize] = React.useState<HiBaseSizeEnum>('md')

 return (
 <> 
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

```


### 添加语言包


```tsx
import React from 'react'
import Provider from '@hi-ui/provider'
import { LocaleEnum } from '@hi-ui/locale-context'
import Pagination from '@hi-ui/pagination'
import DatePicker from '@hi-ui/date-picker'
import Select from '@hi-ui/select'

// 按需引入语言包
import jaJP from '@hi-ui/locale-context/locale/ja-JP'
import koKR from '@hi-ui/locale-context/locale/ko-KR'
import thTH from '@hi-ui/locale-context/locale/th-TH'
import viVN from '@hi-ui/locale-context/locale/vi-VN'
import frFR from '@hi-ui/locale-context/locale/fr-FR'
import deDE from '@hi-ui/locale-context/locale/de-DE'
import esES from '@hi-ui/locale-context/locale/es-ES'
import itIT from '@hi-ui/locale-context/locale/it-IT'
import ptPT from '@hi-ui/locale-context/locale/pt-PT'
import ptBR from '@hi-ui/locale-context/locale/pt-BR'
import ruRU from '@hi-ui/locale-context/locale/ru-RU'
import azAZ from '@hi-ui/locale-context/locale/az-AZ'
import hyAM from '@hi-ui/locale-context/locale/hy-AM'
import kaGE from '@hi-ui/locale-context/locale/ka-GE'
import uzUZ from '@hi-ui/locale-context/locale/uz-UZ'
import bsBA from '@hi-ui/locale-context/locale/bs-BA'
import bgBG from '@hi-ui/locale-context/locale/bg-BG'
import urPK from '@hi-ui/locale-context/locale/ur-PK'
import nlNL from '@hi-ui/locale-context/locale/nl-NL'
import csCZ from '@hi-ui/locale-context/locale/cs-CZ'
import daDK from '@hi-ui/locale-context/locale/da-DK'
import elGR from '@hi-ui/locale-context/locale/el-GR'
import fiFI from '@hi-ui/locale-context/locale/fi-FI'
import trTR from '@hi-ui/locale-context/locale/tr-TR' 
export const LocaleExtends = () => {
 const [locale, setLocale] = React.useState<LocaleEnum | undefined>(undefined)

 // 所有支持的语言列表
 const languageOptions = [
 // 亚洲语言
 { id: 'zh-CN', title: '中文简体' },
 { id: 'zh-HK', title: '中文（香港）' },
 { id: 'zh-TW', title: '中文繁体（台湾）' },
 { id: 'ja-JP', title: '日语' },
 { id: 'ko-KR', title: '韩语' },
 { id: 'vi-VN', title: '越语' },
 { id: 'th-TH', title: '泰语' },
 // 欧洲语言
 { id: 'en-US', title: '英语' },
 { id: 'pt-PT', title: '葡萄牙语（欧洲）' },
 { id: 'pt-BR', title: '葡萄牙语（巴西）' },
 { id: 'fr-FR', title: '法语' },
 { id: 'de-DE', title: '德语' },
 { id: 'es-ES', title: '西班牙语' },
 { id: 'it-IT', title: '意大利语' },
 { id: 'nl-NL', title: '荷兰语' },
 { id: 'el-GR', title: '希腊语' },
 { id: 'cs-CZ', title: '捷克语' },
 { id: 'da-DK', title: '丹麦语' },
 { id: 'fi-FI', title: '芬兰语' },
 { id: 'tr-TR', title: '土耳其语' },
 // 高加索和中亚语言
 { id: 'hy-AM', title: '亚美尼亚语' },
 { id: 'az-AZ', title: '阿塞拜疆语' },
 { id: 'ru-RU', title: '俄语' },
 { id: 'ka-GE', title: '格鲁吉亚语' },
 { id: 'uz-UZ', title: '乌兹别克语' },
 // 巴尔干语言
 { id: 'bs-BA', title: '波斯尼亚语' },
 { id: 'bg-BG', title: '保加利亚语' },
 // 南亚语言
 { id: 'ur-PK', title: '乌尔都语' },
 ]

 React.useEffect(() => {
 // 正常情况下面这段代码可直接写在组件外面，由于组件示例的限制，这里写在了组件内部
 Provider.extends('ja-JP', jaJP)
 Provider.extends('ko-KR', koKR)
 Provider.extends('th-TH', thTH)
 Provider.extends('vi-VN', viVN)
 Provider.extends('fr-FR', frFR)
 Provider.extends('de-DE', deDE)
 Provider.extends('es-ES', esES)
 Provider.extends('it-IT', itIT)
 Provider.extends('pt-PT', ptPT)
 Provider.extends('pt-BR', ptBR)
 Provider.extends('ru-RU', ruRU)
 Provider.extends('az-AZ', azAZ)
 Provider.extends('hy-AM', hyAM)
 Provider.extends('ka-GE', kaGE)
 Provider.extends('uz-UZ', uzUZ)
 Provider.extends('bs-BA', bsBA)
 Provider.extends('bg-BG', bgBG)
 Provider.extends('ur-PK', urPK)
 Provider.extends('nl-NL', nlNL)
 Provider.extends('cs-CZ', csCZ)
 Provider.extends('da-DK', daDK)
 Provider.extends('el-GR', elGR)
 Provider.extends('fi-FI', fiFI)
 Provider.extends('tr-TR', trTR)
 }, [])

 return (
 <> 
 <div className="provider-basic__wrap">
 <Provider locale={locale}>
 <Select
 style={{ width: 240 }}
 placeholder="选择语言"
 data={languageOptions}
 value={locale}
 onChange={(val) => setLocale(val as LocaleEnum)}
 />

 <DatePicker style={{ width: 240, margin: '24px 0' }} />
 <Pagination
 total={200}
 pageSize={10}
 showTotal
 showJumper
 pageSizeOptions={[10, 20, 50, 100]}
 />
 </Provider>
 </div>
 </>
 )
}

```


### 创建语言变体

使用 Provider.merge() 基于现有语言创建变体，只需覆盖部分翻译


```tsx
import React from 'react'
import Provider from '@hi-ui/provider'
import DatePicker from '@hi-ui/date-picker'
import Modal from '@hi-ui/modal'
import Pagination from '@hi-ui/pagination'
import Button from '@hi-ui/button'
import Select from '@hi-ui/select' 
export const LocaleMerge = () => {
 const [visible, setVisible] = React.useState(false)
 const [locale, setLocale] = React.useState<string>('zh-CN')

 // 基于中文创建"儿童版"语言
 React.useEffect(() => {
 Provider.merge('zh-CN', 'zh-CN-child', {
 datePicker: {
 ok: '好啦',
 placeholder: ['选个日期吧'],
 dateChoose: '选日期',
 timeChoose: '选时间',
 },
 pagination: {
 total: ['一共有', '条数据哦'],
 simple: ['第', '页', '共', '页', '条记录'],
 item: '条',
 itemPerPage: '页',
 goto: '跳到',
 page: '页',
 },
 modal: {
 confirmText: '好的',
 cancelText: '不要',
 },
 })
 }, [])

 const localeOptions = [
 { id: 'zh-CN', title: '中文' },
 { id: 'zh-CN-child', title: '中文（儿童版）' },
 ]

 return (
 <> 
 <div className="provider-merge__wrap">
 <Provider locale={locale as any}>
 <Select
 style={{ width: 240 }}
 placeholder="Select language"
 data={localeOptions}
 value={locale}
 onChange={(val) => setLocale(val as string)}
 />

 <DatePicker style={{ width: 240, margin: '24px 0' }} />
 <Pagination total={100} pageSize={10} showTotal style={{ margin: '24px 0' }} />
 <Button type="primary" onClick={() => setVisible(true)}>
 Open Modal
 </Button>
 <Modal
 title="Notification"
 visible={visible}
 onConfirm={() => setVisible(false)}
 onCancel={() => setVisible(false)}
 >
 Check the button text
 </Modal>
 </Provider>
 </div>
 </>
 )
}

```


## Props

### Provider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ------------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| locale | 设置国际化 locale 地区标识 | LocaleEnum | "zh-CN" \| "zh-Hans" \| "en-US" \| "zh-HK" \| "zh-TW" \| "th-TH" \| "pt-PT" \| "pt-BR" \| "fr-FR" \| "de-DE" \| "es-ES" \| "it-IT" \| "nl-NL" \| "el-GR" \| "cs-CZ" \| "da-DK" \| "fi-FI" \| "tr-TR" \| "ja-JP" \| "ko-KR" \| "vi-VN" \| "hy-AM" \| "az-AZ" \| "ru-RU" \| "ka-GE" \| "uz-UZ" \| "bs-BA" \| "bg-BG" \| "ur-PK" | - |
| languages | 自定义语言包，将忽略内置语言包 locale 字段 | LocaleLanguage | - | - |
| portal | 指定 portal 的容器 | UsePortalContext | - | - |
| size | | "xs" \| "sm" \| "md" \| "lg" | "xs" \| "sm" \| "md" \| "lg" | - |
| utcOffset | | number | - | - |
| alert | | ComponentStyleConfig | - | - |
| anchor | | ComponentStyleConfig | - | - |
| anchorItem | | ComponentStyleConfig | - | - |
| breadcrumb | | ComponentStyleConfig | - | - |
| button | | ComponentStyleConfig | - | - |
| card | | ComponentStyleConfig | - | - |
| cascader | | ComponentStyleConfig | - | - |
| checkbox | | ComponentStyleConfig | - | - |
| checkCascader | | ComponentStyleConfig | - | - |
| checkSelect | | ComponentStyleConfig | - | - |
| checkTreeSelect | | ComponentStyleConfig | - | - |
| collapsePanel | | ComponentStyleConfig | - | - |
| counter | | ComponentStyleConfig | - | - |
| datePicker | | ComponentStyleConfig | - | - |
| descriptions | | ComponentStyleConfig | - | - |
| drawer | | ComponentStyleConfig | - | - |
| dropdown | | ComponentStyleConfig | - | - |
| emptyState | | ComponentStyleConfig | - | - |
| form | | ComponentStyleConfig | - | - |
| formItem | | ComponentStyleConfig | - | - |
| input | | ComponentStyleConfig | - | - |
| list | | ComponentStyleConfig | - | - |
| loading | | ComponentStyleConfig | - | - |
| message | | ComponentStyleConfig | - | - |
| menu | | ComponentStyleConfig | - | - |
| groupMenu | | ComponentStyleConfig | - | - |
| sideMenu | | ComponentStyleConfig | - | - |
| menuSearch | | ComponentStyleConfig | - | - |
| modal | | ComponentStyleConfig | - | - |
| notification | | ComponentStyleConfig | - | - |
| numberInput | | ComponentStyleConfig | - | - |
| pageHeader | | ComponentStyleConfig | - | - |
| pagination | | ComponentStyleConfig | - | - |
| picker | | ComponentStyleConfig | - | - |
| popper | | ComponentStyleConfig | - | - |
| popConfirm | | ComponentStyleConfig | - | - |
| popover | | ComponentStyleConfig | - | - |
| preview | | ComponentStyleConfig | - | - |
| progress | | ComponentStyleConfig | - | - |
| queryFilter | | ComponentStyleConfig | - | - |
| filterDrawer | | ComponentStyleConfig | - | - |
| radio | | ComponentStyleConfig | - | - |
| radioGroup | | ComponentStyleConfig | - | - |
| rating | | ComponentStyleConfig | - | - |
| result | | ComponentStyleConfig | - | - |
| select | | ComponentStyleConfig | - | - |
| slider | | ComponentStyleConfig | - | - |
| stepper | | ComponentStyleConfig | - | - |
| switch | | ComponentStyleConfig | - | - |
| textarea | | ComponentStyleConfig | - | - |
| tabs | | ComponentStyleConfig | - | - |
| tabList | | ComponentStyleConfig | - | - |
| timePicker | | ComponentStyleConfig | - | - |
| timeline | | ComponentStyleConfig | - | - |
| table | | ComponentStyleConfig | - | - |
| transfer | | ComponentStyleConfig | - | - |
| tooltip | | ComponentStyleConfig | - | - |
| tree | | ComponentStyleConfig | - | - |
| treeSelect | | ComponentStyleConfig | - | - |
| upload | | ComponentStyleConfig | - | - |
| accentColor | 内置主题强调色，共 8 种色系选择 | DesignSystemAccentColorEnum | "brandblue" \| "ultramarine" \| "pastelblue" \| "skyblue" \| "orange" \| "amber" \| "purple" \| "cyan" | - |
| theme | 自定义主题，包括色彩、圆角、边框、动效等 | ThemeDataProps | - | - |


### createSystem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| color | | { primary?: DesignSystemColorProps; success?: DesignSystemColorProps \| undefined; warning?: DesignSystemColorProps \| undefined; danger?: DesignSystemColorProps \| undefined; gray?: DesignSystemColorProps \| undefined; } \| undefined | { primary?: DesignSystemColorProps \| undefined; success?: DesignSystemColorProps \| undefined; warning?: DesignSystemColorProps \| undefined; danger?: DesignSystemColorProps \| undefined; gray?: DesignSystemColorProps \| undefined; } | - |
| spacing | | DesignSystemSpacingProps | - | - |
| zindex | | DesignSystemZindexProps | - | - |
| shadow | | DesignSystemShadowProps | - | - |
| height | | DesignSystemHeightProps | - | - |
| border | | { size?: DesignSystemBorderSizeProps; radius?: DesignSystemBorderRadiusProps \| undefined; } \| undefined | { size?: DesignSystemBorderSizeProps \| undefined; radius?: DesignSystemBorderRadiusProps \| undefined; } | - |
| motion | | { duration?: DesignSystemMotionDurationProps; bezier?: DesignSystemMotionBezierProps \| undefined; } \| undefined | { duration?: DesignSystemMotionDurationProps \| undefined; bezier?: DesignSystemMotionBezierProps \| undefined; } | - |
| text | | { size?: DesignSystemTextSizeProps; weight?: DesignSystemTextWeightProps \| undefined; spacing?: DesignSystemTextSpacingProps \| undefined; lineheight?: DesignSystemTextLineheightProps \| undefined; } \| undefined | { size?: DesignSystemTextSizeProps \| undefined; weight?: DesignSystemTextWeightProps \| undefined; spacing?: DesignSystemTextSpacingProps \| undefined; lineheight?: DesignSystemTextLineheightProps \| undefined; } | - |


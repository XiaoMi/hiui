# Form 表单

用来收集数据的组件集合

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input' 
export const Basic = () => {
 const FormItem = Form.Item

 return (
 <> 
 <div className="form-basic__wrap">
 <Form initialValues={{ testInput: 1, testInput2: 'testInput2' }} labelWidth={80}>
 <FormItem field="testInput" valueType="number" label="用户名">
 <Input />
 </FormItem>
 <FormItem field="testInput2" valueType="string" label="密码">
 <Input />
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 对齐方式

表单项较少，对应标题字数易对齐工整


```tsx
import React from 'react'
import Form, { FormHelpers, FormProps } from '@hi-ui/form'
import Input from '@hi-ui/input'
import Radio from '@hi-ui/radio' 
export const LabelPlacement = () => {
 const FormItem = Form.Item
 const FormSubmit = Form.Submit
 const RadioGroup = Radio.Group

 const formRef = React.useRef<FormHelpers>(null)

 const [labelPlacement, setLabelPlacement] = React.useState<FormProps['labelPlacement']>('left')

 return (
 <> 
 <div className="form-label-placement__wrap">
 <RadioGroup
 style={{ marginBottom: 24 }}
 data={[
 { title: '左对齐', id: 'left' },
 { title: '右对齐', id: 'right' },
 { title: '顶对齐', id: 'top' },
 ]}
 value={labelPlacement}
 onChange={(value) => setLabelPlacement(value as FormProps['labelPlacement'])}
 />

 <Form
 innerRef={formRef}
 initialValues={{ productCode: '', productName: '' }}
 labelWidth="100"
 labelPlacement={labelPlacement}
 >
 <FormItem required={true} label="编码" field="productCode" valueType="string">
 <Input placeholder="请输入" />
 </FormItem>
 <FormItem required={true} label="产品名称" field="productName" valueType="string">
 <Input placeholder="请输入" />
 </FormItem>
 <FormItem label="" field="productName" valueType="string">
 <FormSubmit type="primary">提交</FormSubmit>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 横向表单

适用于筛选或查询数据的场景，和表格配合使用


```tsx
import React from 'react'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button' 
export const Placement = () => {
 const FormItem = Form.Item

 return (
 <> 
 <div className="form-label-placement__wrap" style={{ width: 900 }}>
 <Form
 initialValues={{
 account: '',
 password: '',
 }}
 placement="horizontal"
 labelPlacement="right"
 >
 <FormItem label="账号" labelWidth="58" field="account" valueType="string">
 <Input placeholder={'请输入'} />
 </FormItem>
 <FormItem label="密码" labelWidth="58" field="password" valueType="string">
 <Input type="password" placeholder={'请输入'} />
 </FormItem>
 <FormItem>
 <Button>提交</Button>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 表单校验

可在Form中配置全部Item的rules,也可在Form.Item中使用rules校验单个表单项


```tsx
import React from 'react'
import Form, { FormHelpers, FormRules } from '@hi-ui/form'
import {
 Input,
 NumberInput,
 Select,
 Cascader,
 Radio,
 Button,
 DatePicker,
 TimePicker,
} from '@hi-ui/hiui' 
export const Validate = () => {
 const FormItem = Form.Item
 const RadioGroup = Radio.Group

 const formRef = React.useRef<FormHelpers>(null)

 const [cascaderOptions] = React.useState([
 {
 id: '手机',
 title: '手机',
 children: [
 {
 id: '小米',
 title: '小米',
 children: [
 {
 id: '小米3',
 title: '小米3',
 },
 {
 id: '小米4',
 title: '小米4',
 },
 ],
 },
 ],
 },
 ])

 const [rules] = React.useState<FormRules>({
 region: [
 {
 required: true,
 message: '请选择区域',
 },
 ],
 store: [
 {
 required: true,
 message: '请选择门店',
 },
 ],
 count: [
 {
 validator: (rule, value, cb) => {
 const count = +value
 if (isNaN(count)) {
 cb(new Error('请输入数字'))
 } else if (count <= 0) {
 cb(new Error('必须是正数'))
 } else {
 cb()
 }
 },
 },
 ],
 count2: [
 {
 required: true,
 message: '请输入数量',
 },
 ],
 })

 return (
 <> 
 <div className="form-validate__wrap" style={{ width: 400 }}>
 <Form
 innerRef={formRef}
 rules={rules}
 labelWidth="80"
 labelPlacement="right"
 initialValues={{
 user: { name: '' },
 name: '',
 region: '',
 count: '',
 count2: null,
 store: '',
 date: new Date(),
 time: '12:00:00',
 }}
 >
 <FormItem
 label="名称"
 field={['user', 'name']}
 valueType="string"
 validateTrigger={['onBlur', 'onChange']}
 rules={[
 {
 required: true,
 message: '请输入名称',
 },
 ]}
 >
 <Input placeholder="请输入" />
 </FormItem>
 <FormItem label="数量" field="count" valueType="number">
 <Input placeholder="请输入" />
 </FormItem>
 {/* 注意：使用 NumberInput 组件时，需要设置 validateTrigger 为 ['onChange'] */}
 <FormItem validateTrigger={['onChange']} label="数量" field="count2" valueType="number">
 <NumberInput placeholder="请输入" />
 </FormItem>
 <FormItem label="门店" field="store" valueType="string">
 <Select
 data={[
 { title: '电视', id: '3' },
 { title: '手机', id: '2' },
 ]}
 />
 </FormItem>
 <FormItem label="品类" field="category" valueType="string">
 <Cascader data={cascaderOptions} />
 </FormItem>
 <FormItem label="地区" field="region" valueType="string">
 <RadioGroup
 data={[
 { id: 'beijing', title: '北京' },
 { id: 'shanghai', title: '上海' },
 ]}
 />
 </FormItem>
 <FormItem
 label="日期"
 field="date"
 valueType="date"
 rules={[
 {
 required: true,
 message: '请选择日期',
 },
 ]}
 >
 <DatePicker />
 </FormItem>

 <FormItem
 label="时间"
 field="time"
 valueType="string"
 rules={[
 {
 required: true,
 message: '请选择时间',
 },
 ]}
 >
 <TimePicker />
 </FormItem>

 <FormItem>
 <>
 <Button
 type="default"
 appearance="line"
 onClick={() => {
 formRef.current?.reset()
 }}
 >
 重置
 </Button>
 <Button
 type="primary"
 onClick={() => {
 console.log(formRef.current?.getFieldsValue())

 formRef.current
 ?.validate()
 .then((values) => {
 console.log('values', values)
 })
 .catch((errors) => {
 console.log('error', errors)
 })
 }}
 >
 提交
 </Button>
 <Button
 type="danger"
 onClick={() => {
 formRef.current?.clearValidates()
 }}
 >
 清除校验信息
 </Button>
 </>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 校验指定表单项

针对单个表单控件值进行校验


```tsx
import React from 'react'
import Form, { FormHelpers } from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import Grid from '@hi-ui/grid' 
export const ValidateField = () => {
 const { Row, Col } = Grid
 const FormItem = Form.Item
 const FormReset = Form.Reset
 const FormSubmit = Form.Submit

 const formRef = React.useRef<FormHelpers>(null)

 const [formData, setFormData] = React.useState<any>({
 phone: '',
 passwordConfirm: '',
 password: '',
 code: '',
 })

 const [countDown, setCountDown] = React.useState(60)
 const [codeDisabled, setCodeDisabled] = React.useState(false)

 const getCode = () => {
 const countDownTimer = setInterval(() => {
 if (countDown - 1 <= 0) {
 clearInterval(countDownTimer)
 setCountDown(60)
 setCodeDisabled(false)
 return
 }

 setCountDown((prev) => prev - 1)
 }, 1000)
 }

 return (
 <> 
 <div className="form-validate-field__wrap" style={{ width: 400 }}>
 <Form
 labelWidth="100"
 labelPlacement="right"
 innerRef={formRef}
 initialValues={formData}
 onValuesChange={(changedValues, allValues) => {
 setFormData(allValues)
 }}
 >
 <FormItem
 label="手机号"
 field="phone"
 valueType="number"
 validateTrigger="onChange"
 rules={[
 {
 validator: (rule, value, callback) => {
 const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/

 if (!value) {
 callback(new Error('请输入手机号'))
 } else if (!telReg.test(value)) {
 callback(new Error('请输入正确的手机号'))
 } else {
 callback()
 }
 },
 },
 ]}
 >
 <Input placeholder="请输入手机号" style={{ width: 240 }} />
 </FormItem>
 <Row gutter={20}>
 <Col span={14}>
 <FormItem
 label="验证码"
 field="code"
 valueType="string"
 rules={[
 {
 required: true,
 message: '请输入验证码',
 },
 ]}
 >
 <Input placeholder="请输入验证码" style={{ width: 130 }} />
 </FormItem>
 </Col>
 <Col span={10}>
 <Button
 type="primary"
 disabled={codeDisabled && countDown <= 60 && countDown >= 0}
 onClick={() => {
 formRef.current?.validateField('phone').then((values) => {
 console.log('values', values)
 setCodeDisabled(true)
 getCode()
 })
 }}
 >
 {countDown < 60 && countDown >= 0 ? `获取中(${countDown})` : '获取验证码'}
 </Button>
 </Col>
 </Row>

 <FormItem valueType={undefined} field={undefined}>
 <>
 <FormReset type="default" appearance="line">
 重置
 </FormReset>
 <FormSubmit type="primary">提交</FormSubmit>
 </>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 是否显示校验提示

适用于无需展示校验提示的场景


```tsx
import React from 'react'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import Card from '@hi-ui/card' 
export const ValidateMessage = () => {
 const FormItem = Form.Item

 return (
 <> 
 <div className="form-validate-message__wrap" style={{ width: 900 }}>
 <Card>
 <Form
 initialValues={{}}
 placement="horizontal"
 labelPlacement="right"
 showValidateMessage={false}
 >
 <FormItem label="商品ID" labelWidth="100" valueType="string">
 <Input placeholder={'请输入'} />
 </FormItem>
 <FormItem label="商品分类" labelWidth="100" valueType="string">
 <Input placeholder={'请输入'} />
 </FormItem>
 <FormItem showValidateMessage={false}>
 <Button>查询</Button>
 </FormItem>
 </Form>
 </Card>
 </div>
 </>
 )
}

```


### 滑动到错误字段

校验失败时，表单会自动滚动至第一个未通过的表单项


```tsx
import React from 'react'
import Form, { FormHelpers, FormRules } from '@hi-ui/form'
import Input from '@hi-ui/input'
import { Select } from '@hi-ui/select'
import { Cascader } from '@hi-ui/cascader'
import Radio from '@hi-ui/radio'
import Button from '@hi-ui/button' 
export const ScrollToError = () => {
 const FormItem = Form.Item
 const RadioGroup = Radio.Group

 const formRef = React.useRef<FormHelpers>(null)

 const [cascaderOptions] = React.useState([
 {
 id: '手机',
 title: '手机',
 children: [
 {
 id: '小米',
 title: '小米',
 children: [
 {
 id: '小米3',
 title: '小米3',
 },
 {
 id: '小米4',
 title: '小米4',
 },
 ],
 },
 ],
 },
 ])

 const [rules] = React.useState<FormRules>({
 region: [
 {
 required: true,
 message: '请选择区域',
 },
 ],
 store: [
 {
 required: true,
 message: '请选择门店',
 },
 ],
 count: [
 {
 required: true,
 validator: (rule, value, cb) => {
 const count = +value
 if (isNaN(count)) {
 cb(new Error('请输入数字'))
 } else if (count <= 0) {
 cb(new Error('必须是正数'))
 } else {
 cb()
 }
 },
 },
 ],
 })

 return (
 <> 
 <div
 className="form-scroll-to-error__wrap"
 style={{
 width: '100%',
 height: 240,
 padding: '20px 0',
 background: '#f2f4f7',
 overflow: 'auto',
 }}
 >
 <div
 style={{
 width: 400,
 }}
 >
 <Form
 innerRef={formRef}
 rules={rules}
 scrollToFirstError
 labelWidth="80"
 labelPlacement="right"
 initialValues={{
 user: { name: '' },
 name: '',
 region: '',
 count: '',
 store: '',
 }}
 >
 <FormItem
 label="名称"
 field={['user', 'name']}
 valueType="string"
 validateTrigger={['onBlur', 'onChange']}
 rules={[
 {
 required: true,
 message: '请输入名称',
 },
 ]}
 >
 <Input placeholder="请输入" />
 </FormItem>
 <FormItem label="数量" field="count" valueType="string">
 <Input placeholder="请输入" />
 </FormItem>
 <FormItem label="门店" field="store" valueType="string">
 <Select
 data={[
 { title: '电视', id: '3' },
 { title: '手机', id: '2' },
 ]}
 />
 </FormItem>
 <FormItem label="品类" field="category" valueType="string">
 <Cascader data={cascaderOptions} />
 </FormItem>
 <FormItem label="地区" field="region" valueType="string">
 <RadioGroup
 data={[
 { id: 'beijing', title: '北京' },
 { id: 'shanghai', title: '上海' },
 ]}
 />
 </FormItem>

 <FormItem>
 <>
 <Button
 type="default"
 appearance="line"
 onClick={() => {
 formRef.current?.reset()
 }}
 >
 重置
 </Button>
 <Button
 type="primary"
 onClick={() => {
 console.log(formRef.current?.getFieldsValue())

 formRef.current
 ?.validate()
 .then((values) => {
 console.log('values', values)
 })
 .catch((errors) => {
 console.log('error', errors)
 })
 }}
 >
 提交
 </Button>

 <Button
 type="danger"
 onClick={() => {
 formRef.current?.clearValidates()
 }}
 >
 清除校验信息
 </Button>
 </>
 </FormItem>
 </Form>
 </div>
 </div>
 </>
 )
}

```


### 设置表单值

控制表单项的值


```tsx
import React from 'react'
import Form, { FormHelpers } from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import { Select } from '@hi-ui/select'
import Grid from '@hi-ui/grid' 
export const SetValues = () => {
 const { Row, Col } = Grid
 const FormItem = Form.Item
 const FormSubmit = Form.Submit
 const FormReset = Form.Reset

 const formRef = React.useRef<FormHelpers>(null)

 const [singleList] = React.useState([
 { title: '电视', id: '3', disabled: true },
 { title: '手机', id: '2' },
 ])

 return (
 <> 
 <div className="form-set-values__wrap" style={{ width: 400 }}>
 <Form
 labelWidth="80"
 labelPlacement="right"
 innerRef={formRef}
 initialValues={{
 phone: '',
 select: '3',
 }}
 >
 <Row gutter>
 <Col>
 <FormItem label="Input" field="phone" valueType="string">
 <Input placeholder="请输入手机号" style={{ width: 200 }} />
 </FormItem>
 </Col>
 <Col>
 <Button type="secondary">Help?</Button>
 </Col>
 </Row>
 <FormItem label="Select" field="select" required={true} valueType="string">
 <Select clearable={false} style={{ width: 200 }} data={singleList} />
 </FormItem>
 <FormItem field={undefined} valueType={undefined}>
 <>
 <FormReset>重置</FormReset>
 <FormSubmit type="primary">提交</FormSubmit>
 <Button
 type="primary"
 appearance="link"
 onClick={() => {
 console.log('填充表单')
 formRef.current?.setFieldsValue({
 phone: '15688888888',
 select: '2',
 })
 }}
 >
 fill Form
 </Button>
 </>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 获取表单值

静默获取表单值：不触发校验


```tsx
import React from 'react'
import Form, { FormHelpers } from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import message from '@hi-ui/message' 
export const GetValues = () => {
 const FormItem = Form.Item

 const formRef = React.useRef<FormHelpers>(null)

 return (
 <> 
 <div className="form-get-values__wrap" style={{ width: 400 }}>
 <Form
 initialValues={{
 phone: '',
 name: '',
 }}
 labelPlacement="left"
 labelWidth={80}
 innerRef={formRef}
 >
 <FormItem
 label="手机号"
 field="phone"
 valueType="string"
 validateTrigger="onChange"
 rules={[
 {
 validator: (rule, value, callback) => {
 const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
 if (!value) {
 callback(new Error('请输入手机号'))
 } else if (!telReg.test(value)) {
 callback(new Error('请输入正确的手机号'))
 } else {
 callback()
 }
 },
 },
 ]}
 >
 <Input placeholder="请输入手机号" style={{ width: 200 }} />
 </FormItem>
 <FormItem required={true} label="姓名" field="name" valueType="string">
 <Input placeholder="请输入" style={{ width: 200 }} />
 </FormItem>
 <FormItem valueType={undefined} field={undefined} showValidateMessage={false}>
 <Button
 type="primary"
 onClick={() => {
 const values = formRef.current?.getFieldsValue()
 console.log('获取表单值, 但是不触发校验方法', values)
 message.open({
 title: JSON.stringify(values),
 })
 }}
 >
 获取表单值
 </Button>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 自定义渲染表单控件


```tsx
import React from 'react'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input' 
export const Render = () => {
 const FormItem = Form.Item

 return (
 <> 
 <div className="form-render__wrap" style={{ width: 400 }}>
 <Form
 initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
 labelPlacement="top"
 >
 <FormItem field="testInput" valueType="string" label="用户名">
 <Input />
 </FormItem>
 <FormItem
 field="testInput2"
 valueType="string"
 label="密码"
 render={(props) => {
 return (
 <div style={{ width: '100%' }}>
 <Input {...props} />
 <span style={{ fontSize: 12, color: '#60636b' }}>
 我是示例提示，请注意大小写哦
 </span>
 </div>
 )
 }}
 />
 </Form>
 </div>
 </>
 )
}

```


### 字段嵌套


```tsx
import React from 'react'
import Form, { FormHelpers } from '@hi-ui/form'
import Input from '@hi-ui/input' 
export const NestedField = () => {
 const FormItem = Form.Item
 const FormReset = Form.Reset
 const FormSubmit = Form.Submit

 const formRef = React.useRef<FormHelpers>(null)

 return (
 <> 
 <div className="form-nested-field__wrap" style={{ width: 400 }}>
 <Form
 innerRef={formRef}
 labelWidth="80"
 labelPlacement="left"
 initialValues={{
 login: {
 phone: '',
 password: '',
 },
 }}
 >
 <FormItem
 label="账号"
 field={['login', 'phone']}
 valueType="string"
 rules={[
 {
 required: true,
 },
 ]}
 >
 <Input placeholder="请输入手机号" />
 </FormItem>
 <FormItem
 label="密码"
 valueType="string"
 field={['login', 'password']}
 rules={[
 {
 required: true,
 },
 ]}
 >
 <Input type="password" placeholder="请输入" />
 </FormItem>
 <FormItem valueType={undefined} field={undefined}>
 <>
 <FormReset>重置</FormReset>
 <FormSubmit type="primary">提交</FormSubmit>
 </>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 动态表单组

动态 Form 删减表单组


```tsx
import React from 'react'
import Form, { FormListHelper } from '@hi-ui/form'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button' 
export const List = () => {
 const FormItem = Form.Item
 const FormList = Form.List

 const formListRef = React.useRef<FormListHelper>(null)

 return (
 <> 
 <div className="form-list__wrap">
 <div style={{ textAlign: 'right', marginBottom: '1em' }}>
 <Button
 type="primary"
 appearance="line"
 onClick={() => formListRef.current?.add({ username: '', password: '' })}
 >
 动态添加成组表单
 </Button>
 </div>
 <Form
 initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
 labelWidth={110}
 rules={{
 testInput: [
 {
 max: 10,
 message: 'max is 10',
 },
 ],
 testInput2: [
 {
 required: true,
 message: 'testInput2 is required',
 },
 ],
 }}
 onValuesChange={(changedValues, allValues) => {
 console.log('changedValues', changedValues)
 console.log('allValues', allValues)
 }}
 >
 <FormItem field="testInput" valueType="string" label="供应商">
 <Input />
 </FormItem>
 <FormItem field="testInput2" valueType="string" label="供应渠道">
 <Input />
 </FormItem>
 <FormList name="testList" innerRef={formListRef}>
 {(fields, { add, remove, insertBefore, swap, move }) => {
 return (
 <div>
 {fields.map((field, index) => {
 return (
 <div key={index}>
 <FormItem
 field={['testList', index, 'username']}
 valueType="string"
 label={`材料名称${index + 1}`}
 required
 rules={[
 {
 required: true,
 message: '请输入',
 },
 ]}
 >
 <Input />
 </FormItem>
 <FormItem
 field={['testList', index, 'password']}
 valueType="string"
 label={`材料颜色${index + 1}`}
 >
 <Input />
 </FormItem>
 <FormItem>
 <div>
 <Button
 size="md"
 type="danger"
 appearance="line"
 onClick={() => remove(index)}
 >
 删除
 </Button>
 <Button
 size="md"
 appearance="line"
 onClick={() => insertBefore(index, { username: '', password: '' })}
 >
 在该组之前插入
 </Button>
 <Button size="md" appearance="line" onClick={() => move(index, 0)}>
 移到数组索引 0 位置
 </Button>
 <Button size="md" appearance="line" onClick={() => swap(index, 0)}>
 和第一个置换值
 </Button>
 </div>
 </FormItem>
 </div>
 )
 })}
 <Button
 type="primary"
 appearance="line"
 onClick={() => add({ username: '', password: '' })}
 >
 动态添加成组表单
 </Button>
 </div>
 )
 }}
 </FormList>
 </Form>
 </div>
 </>
 )
}

```


### 表单联动

根据数据控制某个表单的显示隐藏或校验规则


```tsx
import React from 'react'
import Form, { FormHelpers } from '@hi-ui/form'
import Button from '@hi-ui/button'
import message from '@hi-ui/message'
import Select from '@hi-ui/select'
import { Counter } from '@hi-ui/counter'
import Checkbox from '@hi-ui/checkbox'
import { DatePicker } from '@hi-ui/date-picker'
import { Cascader } from '@hi-ui/cascader'
import Radio from '@hi-ui/radio'
import { Switch } from '@hi-ui/switch'
import { Rating } from '@hi-ui/rating'
import { Upload } from '@hi-ui/upload' 
export const Cascade = () => {
 const FormItem = Form.Item
 const FormReset = Form.Reset
 const FormSubmit = Form.Submit

 const CheckboxGroup = Checkbox.Group
 const RadioGroup = Radio.Group

 const formRef = React.useRef<FormHelpers>(null)
 const [formData, setFormData] = React.useState<any>({
 controlCounter: 'show',
 select: '3',
 counter: 3,
 radio: 0,
 rating: 3,
 checkbox: [],
 switch: false,
 })

 return (
 <> 
 <div className="form-cascade__wrap">
 <Form
 labelWidth="140"
 labelPlacement="right"
 innerRef={formRef}
 initialValues={formData}
 onValuesChange={(changedValues, allValues) => {
 console.log('changedValues,allValues', changedValues, allValues)
 setFormData(allValues)
 }}
 onReset={(values) => {
 console.log('onReset values', values)
 }}
 rules={{
 counter: [
 {
 required: true,
 },
 ],
 }}
 >
 <FormItem label="表单名称" field={null} valueType={null}>
 <>动态表单</>
 </FormItem>
 <FormItem label="控制Counter" field="controlCounter" valueType="string">
 <Select
 clearable={false}
 style={{ width: 300 }}
 data={[
 {
 id: 'hide',
 title: '隐藏Counter',
 },
 {
 id: 'show',
 title: '显示Counter',
 },
 ]}
 placeholder="控制Counter的显示隐藏"
 />
 </FormItem>

 {formData.controlCounter === 'show' ? (
 <FormItem label="Counter" field="counter" required valueType="number">
 <Counter step={1} min={-10} max={10} />
 </FormItem>
 ) : null}

 <FormItem
 label="Checkbox"
 field="checkbox"
 validateTrigger="onChange"
 rules={[
 {
 required: true,
 },
 ]}
 valueType="array"
 >
 <CheckboxGroup
 data={[
 { id: 'DatePicker', title: 'DatePicker' },
 { id: 'Cascader', title: 'Cascader' },
 { id: 'Radio', title: 'Radio' },
 ]}
 ></CheckboxGroup>
 </FormItem>

 {formData.checkbox.includes('DatePicker') && (
 <FormItem label="DatePicker" field="datePicker" required={true} valueType="array">
 <DatePicker type="daterange" />
 </FormItem>
 )}
 {formData.checkbox.includes('Cascader') && (
 <FormItem label="Cascader" field="Cascader" valueType="string">
 <Cascader
 data={[
 {
 id: '手机',
 title: '手机',
 children: [
 {
 id: '小米',
 title: '小米',
 children: [
 {
 id: '小米3',
 title: '小米3',
 },
 {
 id: '小米4',
 title: '小米4',
 },
 ],
 },
 ],
 },
 ]}
 style={{ width: 300 }}
 />
 </FormItem>
 )}
 {formData.checkbox.includes('Radio') && (
 <FormItem label="Radio" field="radio" valueType="string">
 <RadioGroup
 data={[
 { id: 0, title: '手机类' },
 { id: 1, title: '电脑类' },
 ]}
 ></RadioGroup>
 </FormItem>
 )}

 <FormItem label="Switch" field="switch" valueType="boolean">
 <Switch content={['ON', 'OFF']} />
 </FormItem>

 <FormItem label="Rating" field="rating" valueType="number">
 <Rating />
 </FormItem>
 <FormItem label="Upload" field="upload" valueType="string" contentPosition="top">
 <Upload
 type="photo"
 uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 onRemove={(file, fileList, index) => {
 return new Promise((resolve) => resolve(true))
 }}
 name={'files[]'}
 defaultFileList={[
 {
 name: 'b.png',
 fileType: 'img',
 uploadState: 'success',
 url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
 },
 ]}
 />
 </FormItem>

 <FormItem field={null} valueType={null}>
 <>
 <FormReset
 onClick={() => {
 console.log('reset form')
 }}
 >
 重置
 </FormReset>
 <FormSubmit
 type="primary"
 onClick={() => {
 const values = formRef.current?.getFieldsValue() ?? {}
 console.log('Get form value:', values)
 console.log('Get form errors:', formRef.current?.getFieldsError())

 message.open({
 title: (
 <div style={{ width: 400, wordBreak: 'break-all' }}>
 {JSON.stringify(values)}
 </div>
 ),
 })
 }}
 >
 提交
 </FormSubmit>

 <Button
 type="primary"
 appearance="link"
 onClick={() => {
 console.log('填充表单')

 formRef.current?.setFieldsValue({
 select: '2',
 phone: '15666666666',
 radio: 0,
 rating: 4,
 counter: 0,
 switch: false,
 datePicker: { start: new Date(), end: new Date() },
 checkbox: ['Phone', 'Computer'],
 cascader: ['手机', '小米', '小米3'],
 })
 }}
 >
 fill Form
 </Button>
 </>
 </FormItem>
 </Form>
 </div>
 </>
 )
}

```


### 自定义样式

Form 传入的 label/content 会作为所有 Form.Item 的默认样式；Form.Item 单独传入 label/content 时以 Form.Item 为准（覆盖 Form）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Form, { FormSemanticName } from '@hi-ui/form'
import Input from '@hi-ui/input' 
export const Semantic = () => {
 const [selected, setSelected] = useState<FormSemanticName | undefined>()

 const FormItem = Form.Item
 const highlightOutline = { outline: '2px solid #ffbe0a' }

 return (
 <> 
 <div className="form-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Form
 initialValues={{ name: '', email: '' }}
 labelWidth={80}
 classNames={{
 root: 'my-form__root',
 label: 'form-default__label',
 content: 'form-default__content',
 }}
 styles={{
 root: selected === 'root' ? highlightOutline : undefined,
 label: selected === 'label' ? highlightOutline : undefined,
 content: selected === 'content' ? highlightOutline : undefined,
 }}
 >
 {/* 未传 label/content：使用 Form 下发的默认样式 */}
 <FormItem field="name" label="用户名">
 <Input placeholder="请输入" />
 </FormItem>
 {/* 传入 label/content：以 Form.Item 为准，覆盖 Form 默认 */}
 <FormItem
 field="email"
 label="邮箱"
 classNames={{
 root: 'my-form-item__root',
 label: 'my-form-item__label',
 content: 'my-form-item__content',
 }}
 styles={{
 root: selected === 'root' ? highlightOutline : undefined,
 label: selected === 'label' ? highlightOutline : undefined,
 content: selected === 'content' ? highlightOutline : undefined,
 }}
 >
 <Input placeholder="请输入邮箱" />
 </FormItem>
 </Form>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: 'Form 根元素（表单容器）' },
 { title: 'label', description: 'Form.Item 标签（label）' },
 { title: 'content', description: 'Form.Item 控件区域（content）' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as FormSemanticName)
 }}
 onMouseLeave={() => {
 setSelected(undefined)
 }}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### Form Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| innerRef | 提供辅助方法的内部引用 | Ref\<FormHelpers\<Record\<string, any>>> | - | - |
| labelWidth | label 宽度，可用任意 CSS 长度单位 | ReactText | - | - |
| labelPlacement | label 对齐的方式 | "left" \| "right" \| "top" | "left" \| "right" \| "top" | "right" |
| placement | label 和表单控件的放置方式 | "vertical" \| "horizontal" | "vertical" \| "horizontal" | "vertical" |
| contentPosition | 在 vertical 放置时，label 相对表单控件垂直对齐的方式 | "top" \| "center" \| "bottom" | "top" \| "center" \| "bottom" | "center" |
| showColon | 配置是否展示冒号 | boolean | true \| false | - |
| showRequiredOnValidateRequired | FormItem 开启 filed 的 required 校验时，展示红色星号 | boolean | true \| false | false |
| showValidateMessage | 是否显示校验提示 | boolean | true \| false | true |
| size | 设置表单尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| initialValues *(required)* | 初始化表单值，只在初始化以及重置时生效；该值是不受控的，和表单中的 defaultValue 的作用类似 | Record\<string, any> | - | - |
| initialErrors | 初始化表单错误 | Record\<string, string> | - | - |
| rules | 校验规则，设置字段的校验逻辑 | Record\<string, FormRuleModel\[]> | - | - |
| validateTrigger | 设置统一的表单校验时机 | string \| string\[] | string \| string\[] | - |
| onValuesChange | 字段值更新时触发回调事件：changedValues: 改变的表单对象，allValues: 所有表单项对象 | ((changedValue: Record\<string, any>, allValues: Record\<string, any>) => void) | - | - |
| onSubmit | 提交时回调 | ((values: Record\<string, any>) => void) | - | - |
| onReset | 重置时回调 | ((values: Record\<string, any>) => void \| Promise\<any>) | (values: Record\<string, any>) => void \| Promise\<any> | - |
| scrollToFirstError | 提交失败自动滚动到第一个错误字段，配置参考：https\://github.com/scroll-into-view/scroll-into-view-if-needed?tab=readme-ov-file#options | boolean \| StandardBehaviorOptions | false \| true \| StandardBehaviorOptions | - |
| classNames | | FormSemanticClassNames | - | - |
| styles | | FormSemanticStyles | - | - |


### FormItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| children | 表单控件或其渲染函数 | ((string \| number \| boolean \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ((props: Record<...>) => ReactNode)) & (boolean \| ... 2 more ... \| ReactPortal)) \| null | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| string & {} \| (props: Record\<string, any>) => ReactNode \| string & ReactElement\<any, string \| JSXElementConstructor\<any>> \| string & ReactNodeArray \| string & ReactPortal \| number & {} \| number & ReactElement\<any, string \| JSXElementConstructor\<any>> \| number & ReactNodeArray \| number & ReactPortal \| false & {} \| false & ReactElement\<any, string \| JSXElementConstructor\<any>> \| false & ReactNodeArray \| false & ReactPortal \| true & {} \| true & ReactElement\<any, string \| JSXElementConstructor\<any>> \| true & ReactNodeArray \| true & ReactPortal \| {} & string \| {} & number \| {} & false \| {} & true \| ReactElement\<any, string \| JSXElementConstructor\<any>> & string \| ReactElement\<any, string \| JSXElementConstructor\<any>> & number \| ReactElement\<any, string \| JSXElementConstructor\<any>> & false \| ReactElement\<any, string \| JSXElementConstructor\<any>> & true \| ReactElement\<any, string \| JSXElementConstructor\<any>> & ReactNodeArray \| ReactElement\<any, string \| JSXElementConstructor\<any>> & ReactPortal \| ReactNodeArray & string \| ReactNodeArray & number \| ReactNodeArray & false \| ReactNodeArray & true \| ReactNodeArray & ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray & ReactPortal \| ReactPortal & string \| ReactPortal & number \| ReactPortal & false \| ReactPortal & true \| ReactPortal & ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactPortal & ReactNodeArray \| ((props: Record\<string, any>) => ReactNode) & string \| ((props: Record\<string, any>) => ReactNode) & number \| ((props: Record\<string, any>) => ReactNode) & false \| ((props: Record\<string, any>) => ReactNode) & true \| ((props: Record\<string, any>) => ReactNode) & ReactElement\<any, string \| JSXElementConstructor\<any>> \| ((props: Record\<string, any>) => ReactNode) & ReactNodeArray \| ((props: Record\<string, any>) => ReactNode) & ReactPortal | - |
| render | 支持表单控件 render 渲染 | ((props: Record\<string, any>) => any) | - | - |
| field | 字段名，支持数组 | FormFieldPath | - | - |
| valueType | 指定控件值数据结构类型 | FormRuleType | - | - |
| rules | 设置字段的验证规则，会覆盖 Form 设置的 rules | FormRuleModel\[] | - | - |
| valuePropName | 自定义设置 Form 往表单控件注入值的属性，如 Switch Radio Checkbox 的是 'checked' | string | - | - |
| valueDispatchTransform | form 从控件个体采集数据的转换器，最终会把返回值转发给 Form | ((...args: any\[]) => any) | - | - |
| valueConnectTransform | 控件个体接收 form 下发数据的转换器，最终会把返回值转发给 FormField | ((value: any) => any) | - | - |
| valueChangeFuncPropName | 自定义设置 Form 从表单控件采集数据回调的属性 | string | - | - |
| validateTrigger | 设置触发该字段校验的时机（值必须是回调函数），会覆盖 Form 设置的 validateTrigger | string \| string\[] | string \| string\[] | - |
| itemClassNames | 由 Form.Item 传入的语义化 classNames（label / content），勿直接使用&#xA;@internal | FormLabelSemanticClassNames | - | - |
| itemStyles | 由 Form.Item 传入的语义化 styles（label / content），勿直接使用&#xA;@internal | FormLabelSemanticStyles | - | - |
| labelPlacement | label 放置的位置 | "left" \| "right" \| "top" | "left" \| "right" \| "top" | - |
| required | 是否显示必填信号。这里不做校验处理，若需校验请使用 rules 进行设置 | boolean | true \| false | - |
| showColon | 是否显示冒号 | boolean | true \| false | - |
| labelWidth | label 宽度，可使用任意 CSS 长度单位。优先级高于 Form 设置的 labelWidth | ReactText | - | - |
| label | label 文案 | ReactNode | - | - |
| contentPosition | 在 vertical 放置时，label 相对表单控件垂直对齐的方式，优先级低于 Form | "top" \| "center" \| "bottom" | "top" \| "center" \| "bottom" | - |
| formMessage | 提示信息 | ReactNode | - | - |
| showValidateMessage | 是否显示校验提示。优先级高于 Form 设置的 showValidateMessage | boolean | true \| false | - |
| classNames | | FormItemSemanticClassNames | - | - |
| styles | | FormItemSemanticStyles | - | - |


### FormList Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| children | 表单控件渲染函数 | ((fields: FormListChildField\[], action: FormListChildrenAction) => ReactElement\<any, string \| JSXElementConstructor\<any>>) | (fields: FormListChildField\[], action: FormListChildrenAction) => ReactElement\<any, string \| JSXElementConstructor\<any>> | - |
| name *(required)* | 列表名称 | FormFieldPath | - | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<FormListHelper> | - | - |


### FormSubmit Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| onClick | 点击提交后触发 | ((result: any, error: any) => void) | - | - |
| type | 设置按钮类型 | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "primary" |
| size | 设置按钮尺寸 | "xs" \| "sm" \| "md" \| "lg" | "xs" \| "sm" \| "md" \| "lg" | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | - |
| classNames | | ButtonSemanticClassNames | - | - |
| styles | | ButtonSemanticStyles | - | - |
| href | 设置按钮链接，设置后将用 a 标签渲染按钮 | string | - | - |
| disabled | 设置按钮是否禁用 | boolean | true \| false | - |
| appearance | 设置按钮外观 | "link" \| "line" \| "text" \| "solid" \| "filled" | "link" \| "line" \| "text" \| "solid" \| "filled" | - |
| loading | 是否显示 loading | boolean | true \| false | - |
| icon | 设置按钮图标 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| shape | 设置按钮形状 | "square" \| "round" | "square" \| "round" | - |


### FormReset Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| onClick | 点击重置后触发 | (() => void) | - | - |
| type | 设置按钮类型 | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "primary" \| "success" \| "danger" \| "default" \| "secondary" | - |
| size | 设置按钮尺寸 | "xs" \| "sm" \| "md" \| "lg" | "xs" \| "sm" \| "md" \| "lg" | - |
| appearance | 设置按钮外观 | "link" \| "line" \| "text" \| "solid" \| "filled" | "link" \| "line" \| "text" \| "solid" \| "filled" | - |
| disabled | 设置按钮是否禁用 | boolean | true \| false | - |
| loading | 是否显示 loading | boolean | true \| false | - |
| href | 设置按钮链接，设置后将用 a 标签渲染按钮 | string | - | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | - |
| icon | 设置按钮图标 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| shape | 设置按钮形状 | "square" \| "round" | "square" \| "round" | - |
| classNames | | ButtonSemanticClassNames | - | - |
| styles | | ButtonSemanticStyles | - | - |


### FormLabel Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | --------------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | ------ |
| itemClassNames | 由 Form.Item 传入的语义化 classNames（label / content），勿直接使用&#xA;@internal | FormLabelSemanticClassNames | - | - |
| itemStyles | 由 Form.Item 传入的语义化 styles（label / content），勿直接使用&#xA;@internal | FormLabelSemanticStyles | - | - |
| labelPlacement | label 放置的位置 | "left" \| "right" \| "top" | "left" \| "right" \| "top" | - |
| required | 是否显示必填信号。这里不做校验处理，若需校验请使用 rules 进行设置 | boolean | true \| false | - |
| showColon | 是否显示冒号 | boolean | true \| false | - |
| labelWidth | label 宽度，可使用任意 CSS 长度单位。优先级高于 Form 设置的 labelWidth | ReactText | - | - |
| label | label 文案 | ReactNode | - | - |
| contentPosition | 在 vertical 放置时，label 相对表单控件垂直对齐的方式，优先级低于 Form | "top" \| "center" \| "bottom" | "top" \| "center" \| "bottom" | - |
| formMessage | 提示信息 | ReactNode | - | - |
| showValidateMessage | 是否显示校验提示。优先级高于 Form 设置的 showValidateMessage | boolean | true \| false | - |


## Type

### FormFieldPath

> (string | number)[] | string | number

### FormHelpers

| 名称 | 说明 | 类型 |
| ------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| reset | 重置整个表单的验证,对应 Form.Reset 中的 API，如果不指定 nextState，则重置为 initialValues | (nextState?: { values?: any, errors?: any }) => Promise<void> |
| validate | 对整个表单进行校验, 对应 Form.Submit 中的 API | () => Promise<Record<string, any>> |
| validateField | 对指定表单字段进行校验 | (fields: FormFieldPath) => Promise<any> |
| setFieldValue | 设置某个表单字段的值，在更新表单数据的的时候，使用该方法 | (field: FormFieldPath, value: any) => void |
| setFieldsValue | 设置多个表单的值，在异步获取的数据回显的时候，使用该方法 | (field: Record<string, any> \| ((prevValues: Record<string, any>) => Record<string, any>)) => void |
| getFieldValue | 获取一个字段名对应的 Value，返回为对应 Field 值 | (field: FormFieldPath) => any |
| getFieldsValue | 获取所有字段名对应的 Values 返回为字典映射数据结构 | () => Record<string, any> |
| getFieldError | 获取一组字段名对应的 errorMessage，返回为对应 field 错误信息 | (field: FormFieldPath) => any |
| getFieldsError | 获取所有字段名对应的错误信息，返回为字典映射数据结构 | () => Record<string, any> |
| clearValidates | 移除所有表单项的校验结果 | () => void |
| clearFieldValidate | 移除表单项的校验结果，传入待移除的表单项的 field 属性组成的数组 | (fields: FormFieldPath) => void |

### FormRuleModel

> [更多规则](https://github.com/yiminghe/async-validator)

| 名称 | 说明 | 类型 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| enum | 是否匹配枚举中的值 | any[] |
| len | string 类型时为字符串长度；number 类型时为确定数字； array 类型时为数组长度 | number |
| max | 必须设置 `type`：string 类型为字符串最大长度；number 类型时为最大值；array 类型时为数组最大长度 | number |
| message | 错误信息 | string |
| min | 必须设置 `type`：string 类型为字符串最小长度；number 类型时为最小值；array 类型时为数组最小长度 | number |
| pattern | 正则表达式匹配 | RegExp |
| required | 是否为必选字段 | boolean |
| transform | 将字段值转换成目标值后进行校验 | (value) => any |
| type | 类型，常见有 `string` \|`number` \|`boolean` \| `email`。更多请参考[此处](https://github.com/yiminghe/async-validator#type) | string |
| validator | 自定义校验 | (rule,value,callback) => void |
| asyncValidator | 自定义异步校验 | (rule,value,callback) => void | Promise |
| whitespace | 如果字段仅包含空格则校验不通过 | boolean |

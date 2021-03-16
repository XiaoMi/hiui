import React, { useRef, useLayoutEffect } from 'react'
import Form from './index'
import Input from '../input'
const FormItem = Form.Item

const MasterDataScheme = () => {
  const basicForm = useRef()

  useLayoutEffect(() => {
    basicForm.current.setFieldsValue({ productCode: '1', productName: 'aaa' })
  }, [])

  return (
    <div>
      <div className={'content-container'}>
        <h3>基础信息</h3>
        <hr></hr>
        <div className={'content-container_basic'}>
          <Form ref={basicForm} labelWidth="80" labelPlacement="top">
            <FormItem required={true} label="产品编码" field="productCode">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem required={true} label="产品名称" field="productName">
              <Input placeholder="请输入" />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default MasterDataScheme

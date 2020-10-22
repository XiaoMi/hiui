import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/Select'
import Grid from '../../../components/grid'
const prefix = 'form-two-col'
const rightOptions = ['上下结构', '左右结构']
const desc = [
  '上下结构：表单项对应的标题长度较长，表单项较多',
  '左右结构：屏幕分辨率较大，表单项较多且对应标题长度短且易对齐'
]
const code = [
  {
    code: `import React from 'react'
import { Form, Input, Grid, Select } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const Row = Grid.Row
    const Col = Grid.Col
    const FormItem = Form.Item
    return (
      <div >
        <Form labelWidth='70' labelPlacement='left'>
          <Row>
            <Col span={12}>
              <FormItem label='姓名' >
                <Input placeholder={'请输入'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='城市' >
                <Select
                  type='multiple'
                  data={[
                    { title:'北京', id:'2' },
                    { title:'上海', id:'2-1' },
                    { title:'南京', id:'2-2' },
                    { title:'深圳', id:'2-3' },
                    { title:'武汉', id:'2-4' },
                    { title:'杭州', id:'3' },
                    { title:'重庆', id:'4' },
                    { title:'成都', id:'5' },
                    { title:'郑州', id:'6' }
                  ]}
                  searchable
                  showCheckAll
                  placeholder='请选择'
                  emptyContent='无匹配数据'
                  onChange={(item) => {
                    console.log('多选结果', item)
                  }}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='手机号' >
                <Input placeholder={'请输入'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='邮箱' >
                <Input type='password' placeholder={'请输入'} />
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            <Button type='primary' onClick={()=>{}}>提交</Button>
            <Button type='line' onClick={()=>{}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}`,
    opt: ['上下结构']
  },
  {
    code: `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const Row = Grid.Row
    const Col = Grid.Col
    const FormItem = Form.Item
    return (
      <div >
        <Form labelWidth='70' labelPlacement='left'>
          <Row>
            <Col span={12}>
              <FormItem label='姓名' >
                <Input placeholder={'请输入'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='密码' >
                <Input type='password' placeholder={'请输入'} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='手机号' >
                <Input placeholder={'请输入'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='邮箱' >
                <Input type='password' placeholder={'请输入'} />
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            <Button type='primary' onClick={()=>{}}>提交</Button>
            <Button type='line' onClick={()=>{}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}`,
    opt: ['左右结构']
  }
]

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Grid, Select }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoRow

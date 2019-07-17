import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import { ThemeContext } from '../../../components/context'
import Grid from '../../../components/grid'
import Button from '../../../components/button'
import Stepper from '../../../components/stepper/Stepper'
import DatePicker from '../../../components/date-picker'
const prefix = 'theme-example'
const code = `
import React from 'react'
import { ThemeContext } from '@hi-ui/hiui/es/context'
import Button from '@hiui/hiui/es/button'
import DatePicker from '@hiui/hiui/es/date-picker'
import Stepper from '@hiui/hiui/es/stepper'
import Grid from '@hiui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    const stepperList = [
      {
        title: '账号信息',
      },
      {
        title: '邮箱激活',
      },
      {
        title: '信息登记',
      },
    ]

    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Button type="primary">突出按钮</Button>
            <Button type="line">普通按钮</Button>
            <Button type="default">默认按钮</Button>
            <Button type="primary">确认</Button>
            <Button type="line">取消</Button>
          </Col>
          <Col span={12}>
            <DatePicker
              type='daterange'
              value={new Date()}
              onChange={(d) => {console.log('last', d)}}
            />
          </Col>
        </Row>

        <ThemeContext.Provider value='orange'>
          <Row gutter={true}>
            <Col span={12}>
              <Button type="primary">突出按钮</Button>
              <Button type="line">普通按钮</Button>
              <Button type="default">默认按钮</Button>
              <Button type="primary">确认</Button>
              <Button type="line">取消</Button>
            </Col>
            <Col span={12}>
              <DatePicker
                type='daterange'
                value={new Date()}
                onChange={(d) => {console.log('last', d)}}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='cyan'>
          <Row gutter={true}>
            <Col span={12}>
              <Button type="primary">突出按钮</Button>
              <Button type="line">普通按钮</Button>
              <Button type="default">默认按钮</Button>
              <Button type="primary">确认</Button>
              <Button type="line">取消</Button>
            </Col>
            <Col span={12}>
              <DatePicker
                type='daterange'
                value={new Date()}
                onChange={(d) => {console.log('last', d)}}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='blue'>
          <Row gutter={true}>
            <Col span={12}>
              <Button type="primary">突出按钮</Button>
              <Button type="line">普通按钮</Button>
              <Button type="default">默认按钮</Button>
              <Button type="primary">确认</Button>
              <Button type="line">取消</Button>
            </Col>
            <Col span={12}>
              <DatePicker
                type='daterange'
                value={new Date()}
                onChange={(d) => {console.log('last', d)}}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='purple'>
          <Row gutter={true}>
            <Col span={12}>
              <Button type="primary">突出按钮</Button>
              <Button type="line">普通按钮</Button>
              <Button type="default">默认按钮</Button>
              <Button type="primary">确认</Button>
              <Button type="line">取消</Button>
            </Col>
            <Col span={12}>
              <DatePicker
                type='daterange'
                value={new Date()}
                onChange={(d) => {console.log('last', d)}}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <Row gutter={true}>
          <Col span={24}>
            <Stepper
              data={stepperList}
              current={1}
            />
          </Col>
        </Row>

        <ThemeContext.Provider value='orange'>
          <Row gutter={true}>
            <Col span={24}>
              <Stepper
                data={stepperList}
                current={1}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='cyan'>
          <Row gutter={true}>
            <Col span={24}>
              <Stepper
                data={stepperList}
                current={1}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='blue'>
          <Row gutter={true}>
            <Col span={24}>
              <Stepper
                data={stepperList}
                current={1}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

        <ThemeContext.Provider value='purple'>
          <Row gutter={true}>
            <Col span={24}>
              <Stepper
                data={stepperList}
                current={1}
              />
            </Col>
          </Row>
        </ThemeContext.Provider>

      </div>
    )
  }
}`
const DemoExample = () => (
  <DocViewer
    code={code}
    scope={{ Grid, ThemeContext, Button, Stepper, DatePicker }}
    prefix={prefix}
  />
)
export default DemoExample

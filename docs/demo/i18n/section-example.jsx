import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import DatePicker from '../../../components/date-picker'
import Pagination from '../../../components/pagination'
import { LocaleContext } from '../../../components/context'
const prefix = 'i18n-example'
const code = `
import React from 'react'
import { LocaleContext } from '@hi-ui/hiui/es/context'
import Pagination from '@hiui/hiui/es/pagination'
import Grid from '@hiui/hiui/es/grid'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 3,
      pageSize: 20
    }
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <div>

        <LocaleContext.Provider value='en-US'>
          <Row gutter={true}>
            <Col span={24}>

              <DatePicker
                type='daterange'
                value={new Date()}
                onChange={(d) => {console.log('last', d)}}
              />

            </Col>
          </Row>
          <Row gutter={true}>
            <Col span={24}>

              <Pagination
                total={400}
                pageSize={this.state.pageSize}
                current={this.state.current}
                showTotal={true}
                sizeChangeEvent={(val, current) => {
                  this.setState({pageSize: val})
                }}
                jumpEvent={(val) => {this.setState({current: val})}}
                onChange={(page, prevPage, pageSize) => {
                  this.setState({
                    current: page,
                  })
                }}
              />

            </Col>
          </Row>
        </LocaleContext.Provider>

      </div>
    )
  }
}`
const DemoExample = () => (
  <DocViewer code={code} scope={{ Grid, LocaleContext, DatePicker, Pagination }} prefix={prefix} />
)
export default DemoExample

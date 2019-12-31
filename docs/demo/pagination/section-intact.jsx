import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
import Grid from '../../../components/grid'
import Checkbox from '../../../components/checkbox'
const prefix = 'pagination-intact'
const desc = '数据量庞大，分页数较多时使用'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Checkbox from '@hi-ui/hiui/es/checkbox'
import Pagination from '@hi-ui/hiui/es/pagination'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 4,
      pageSize: 10,
      optionsList: [{
        content: '显示总数量',
        id: 'showTotal'
      }, {
        content: '显示跳转至...',
        id: 'showJumper'
      }],
      value: ['showJumper', 'showTotal']
    }
  }

  get showTotal () {
    return this.state.value.includes('showTotal')
  }

  get showJumper () {
    return this.state.value.includes('showJumper')
  }

  render() {
    const pageSizeOptions = [10, 20, 50, 100]
    const Row = Grid.Row
    const Col = Grid.Col
    const { optionsList, pageSize, current, value } = this.state
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Checkbox.Group
              data={optionsList}
              legacy={false}
              value={value}
              onChange={(value) => {
                this.setState({ value })
              }}
            />
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={24}>
            <Pagination
              total={60000}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              current={current}
              showTotal={this.showTotal}
              showJumper={this.showJumper}
              onJump={(val) => { this.setState({ current: val })} }
              onPageSizeChange={(val, current) => {
                  console.log('每页', val, '条', '当前第', current, '页')
                  this.setState({pageSize: val})
                }
              }
              onChange={(page, prevPage, pageSize) => {
                console.log(page, prevPage, pageSize)
                this.setState({
                  current: page,
                })
              }}
            />
           </Col>
        </Row>
      </div>
    )
  }
}`
const DemoIntact = () => (
  <DocViewer
    code={code}
    scope={{ Pagination, Grid, Checkbox }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoIntact

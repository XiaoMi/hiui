import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
import Grid from '../../../components/grid'
import Checkbox from '../../../components/checkbox'
const prefix = 'pagination-intact'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'
import Checkbox from '@hiui/hiui/es/Checkbox'
import Pagination from '@hiui/hiui/es/pagination'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 4,
      pageSize: 10,
      optionsList: [{
        content: '显示跳转至...',
        id: 'showQuickJumper'
      }, {
        content: '显示总数量',
        id: 'showTotal'
      }],
      showTotal: true,
      showQuickJumper: true
    }
  }

  render() {
    const pageSizeOptions = [{
      value: 10,
      title: '10'
    }, {
      value: 20,
      title: '20'
    }, {
      value: 50,
      title: '50'
    }, {
      value: 100,
      title: '100'
    }]
    const Row = Grid.Row
    const Col = Grid.Col
    const { showQuickJumper, showTotal, optionsList, pageSize, current } = this.state
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Checkbox.Group
              data={optionsList}
              legacy={false}
              onChange={(val) => {
                this.setState({
                  [val]: !this.state[val]
                })
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
              defaultCurrent={current}
              showTotal={showTotal}
              showQuickJumper={showQuickJumper}
              jumpEvent={(val) => {this.setState({current: val})}}
              sizeChangeEvent={(val, current) => {
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
  />
)
export default DemoIntact

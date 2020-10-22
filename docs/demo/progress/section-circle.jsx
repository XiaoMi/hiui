import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'progress-circle'
const desc = '在局限空间里展示加载进度，如图片上传、附件上传'
const code = `import React from 'react'
import { Grid, Radio, Button, Progress } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      percent: 10,
      typeList:[
        {
          id:'large',
          content:'大号'
        },
        {
          id:'default',
          content:'中号'
        },
        {
          id:'small',
          content:'小号'
        }
      ],
      position:'large',
      radius: 60
    }
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { radius } = this.state
    return (
      <div>
      <Row gutter>
        <Col span={12}>
        <Radio.Group
          type='button'
          data={this.state.typeList}
          value={this.state.position}
          onChange={(data) => {
            if(data === 'large'){
              this.setState({
                radius: 60
              })
            }else if(data === 'default'){
              this.setState({
                radius: 50
              })
            }else{
              this.setState({
                radius: 40
              })
            }
            this.setState({
              position: data
            })
          }}
        />
        </Col>
      </Row>
      <Row gutter>
        <Col span={24}>
          <div style={{display:'inline-block'}}>
            <Progress percent={this.state.percent} apperance='circle' radius={radius}/>
          </div>
          <div style={{display:'inline-block',marginLeft: '50px'}}>
            <Progress percent={this.state.percent} apperance='circle' type='error' radius={radius} content={<i className='hi-icon icon-close' style={{fontSize: '18px'}}/>}/>
          </div>
          <div style={{display:'inline-block',marginLeft: '50px'}}>
            <Progress percent={this.state.percent} apperance='circle' type='warn' radius={radius} content={<i className='hi-icon icon-alarm' style={{fontSize: '18px'}}/>}/>
          </div>
          <div style={{display:'inline-block',marginLeft: '50px'}}>
            <Progress percent={this.state.percent} apperance='circle' type='success' radius={radius} content={<i className='hi-icon icon-check' style={{fontSize: '18px'}}/>} />
          </div>
        </Col>
      </Row>



      </div>
    )
  }
}`
const DemoCircle = () => <DocViewer code={code} scope={{ Progress, Grid, Radio, Button }} prefix={prefix} desc={desc} />
export default DemoCircle

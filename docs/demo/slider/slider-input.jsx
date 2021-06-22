import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
const prefix = 'slider-input'
const rightOptions = ['水平', '垂直']
const desc = '滑动输入连续或离散数据的单点值或范围值'

const code = [
  {
    code: `import React from 'react'
import { Slider, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 9,
      valueCache:10,
      max:90,
      min:10
    }
  }
  componentDidMount(){
    const {min,max,value} = this.state
    if(value<min){
      this.setState({
        value:min
      })
    }
    if(value>max){
      this.setState({
        value:max
      })
    }
  }
  onChange(e){
    let valueCache = e.target.value.replace(/[^0-9]/g, '')
    this.setState({
      valueCache
    })
  }
  
  handleInput(value){
    const {min,max} = this.state
    if(value<min){
      value = min
    }
    if(value>max){
      value = max
    }
    this.setState({
      valueCache:value,
      value
    });
  }

  render() {
    const {Row, Col} = Grid
    const {value,max,min,valueCache} = this.state

    return (
      <Row>
        <Col span={22}>
          <Slider defaultValue={10} onChange={(value)=>this.handleInput(value)} value={this.state.value}  max={90}  min={10}  showRangeLabel={true}/>
        </Col>
        <Col span={2}>
          <Input    
            style={{width:80,marginLeft:30}}
            autoFocus
            value={valueCache}
            onChange ={(e)=>this.onChange(e)}
            onBlur={(e)=>this.handleInput(+e.target.value)}
            onKeyDown={(e)=>{
              if(e.keyCode == 13){
                this.handleInput(+e.target.value)
              }
            }}
          />
        </Col>
      </Row>
    
    )
  }
}`,
    opt: ['水平']
  },
  {
    code: `import React from "react";

    class Demo extends React.Component {
      constructor() {
        super()
        this.state = {
          value: 9,
          valueCache:10,
          max:90,
          min:10
        }
      }
    
      onChange(e){
        let valueCache = e.target.value.replace(/[^0-9]/g, '')
        this.setState({
          valueCache
        })
      }
      componentDidMount(){
        const {min,max,value} = this.state
        if(value<min){
          this.setState({
            value:min
          })
        }
        if(value>max){
          this.setState({
            value:max
          })
        }
      }
      handleInput(value){
        const {min,max} = this.state
        if(value<min){
          value = min
        }
        if(value>max){
          value = max
        }
        this.setState({
          valueCache:value,
          value
        });
      }

      render() {
        const { value,valueCache,max,min } = this.state;
        return (
          <div
            style={{
              width: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft:50
            }}
          >
            <div
              style={{
                height: 300,
              }}
            >
              <Slider
                vertical
                defaultValue={30}
                showRangeLabel={true}
                vertical
                value={value}
                min={min}
                max={max}
                onChange ={(value)=>this.handleInput(value)}
              />
            </div>
            <div
              style={{
                width: 80,
                marginTop: 20,
              }}
            >
            <Input    
              style={{width:80}}
              autoFocus
              value={valueCache}
              onChange ={(e)=>this.onChange(e)}
              onBlur={(e)=>this.handleInput(+e.target.value)}
              onKeyDown={(e)=>{
                if(e.keyCode == 13){
                  this.handleInput(+e.target.value)
                }
              }}
            />
            </div>
          </div>
        );
      }
    }
    `,
    opt: ['垂直']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Slider, Grid, Input }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoBase

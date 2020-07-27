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

  onChange(e){
    let valueCache = e.target.value.replace(/[^0-9]/g, '')
    this.setState({
      valueCache
    })
  }
  
  handleInput(e){
    
    let value  = e.target.value
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
  componentDidMount(){
    // this.input.focus()
  }

  render() {
    const {Row, Col} = Grid
    const {value,max,min,valueCache} = this.state

    return (
      <Row>
        <Col span={22}>
          <Slider defaultValue={10} onChange={(value)=>{
            this.setState({
              value,
              valueCache:value
            });
          }} value={this.state.value}  max={max}  min={min}/>
        </Col>
        <Col span={2}>
          <Input    
            ref={node=>this.input=node}
            style={{width:80,marginLeft:30}}
            autoFocus
            value={valueCache}
            onChange ={(e)=>this.onChange(e)}
            onBlur={(e)=>this.handleInput(e)}
            onKeyDown={(e)=>{
              if(e.keyCode == 13){
                this.handleInput(e)
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
        // this.input.focus()
      }

      handleInput(e){
        let value  = e.target.value
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
        console.log(valueCache)
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
                vertical
                value={value}
                min={min}
                max={max}
                onChange ={(value)=>{
                  console.log(value)
                  this.setState({
                    value,
                    valueCache:value
                  });
                }}
              />
            </div>
            <div
              style={{
                width: 80,
                marginTop: 20,
              }}
            >
            <Input    
              ref={node=>this.input=node}
              style={{width:80}}
              autoFocus
              // style={{ margin: '0 16px',width:80,height:30,boxSizing:'border-box',border:'1px solid #d8d8d8',outline:'none' }}
              value={valueCache}
              onChange ={(e)=>this.onChange(e)}
              onBlur={(e)=>this.handleInput(e)}
              onKeyDown={(e)=>{
                if(e.keyCode == 13){
                  this.handleInput(e)
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
  <DocViewer
    code={code}
    scope={{ Slider, Grid, Input }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoBase

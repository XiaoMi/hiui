import React from "react";
import DocViewer from "../../../libs/doc-viewer";
import Slider from "../../../components/slider";
import Grid from '../../../components/grid'
import Input from '../../../components/input'
const prefix = "slider-input";
const rightOptions = ["垂直","水平"];
const desc = "滑动输入连续或离散数据的单点值或范围值";

const code = [
  {
    code: `import React from 'react'
    import { Slider, Input, Grid } from '@hi-ui/hiui'
    class Demo extends React.Component {
    
      constructor() {
        super()
        this.state = {
          value: 10
        }
      }
      onChange(e){
        this.setState({
          value:e.target.value,
        });
      }
      render() {
        const {Row, Col} = Grid
        const {value} = this.state
        return (
          <Row>
            <Col span={22}>
              <Slider defaultValue={10} onChange={(value)=>{
                this.setState({
                  value,
                });
              }} value={this.state.value}/>
            </Col>
            <Col span={2}>
              <Input
                style={{ margin: '0 16px' }}
                value={value}
                type="number"
                onChange={(v)=>this.onChange(v)}
              />
            </Col>
          </Row>
        
        )
      }
    }`,
    opt: ["水平"],
  },
  {
    code: `import React from "react";

    class Demo extends React.Component {
      constructor() {
        super();
        this.state = {
          value: 10,
        };
      }
      onChange(e) {
        console.log( e.target.value)
        this.setState({
          value: e.target.value,
        });
      }
      render() {
        const { value } = this.state;
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
                onChange={(value)=>{
                  this.setState({
                    value,
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
                value={value}
                onChange={(v) => this.onChange(v)}
                type="number"
              />
            </div>
          </div>
        );
      }
    }
    `,
    opt: ["垂直"],
  }
];

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Slider,Grid,Input }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
);
export default DemoBase;

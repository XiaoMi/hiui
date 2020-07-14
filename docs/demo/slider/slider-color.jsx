import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-color'
const desc =
  '可选滑块条的颜色'

const code = `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            value: 80,
            color: [{
                color: '#4284F5',
                type: 'primary'
            }, {
                color: '#E65C2F',
                type: 'danger'
            }, {
                color: '#0EC848',
                type: 'success'
            }, {
                color: '#e19d0c',
                type: 'warning'
            }],
            type: 'primary'
        }
    }
    onHandleChange(type) {
        this.setState({
            type
        })
    }
    render() {
        const { value, color, type } = this.state
        return (
            <>
                <div style={{ display: 'flex', 'justifyContent': 'flex-end' }}>
                    {color.map(item => <span style={{
                        width: 25, 
                        height: 22, 
                        marginRight: 12, 
                        background: item.color, 
                        display: 'inline-block', 
                        cursor: 'pointer', 
                        boxShadow: type === item.type ? '0px 2px 4px 0px rgba(0,0,0,0.5)' : 'none' }} 
                        onClick={() => { this.onHandleChange(item.type) }} key={item.color}></span>)}
                </div>
                <Slider defaultValue={this.state.value} type={type} />
            </>
        )
    }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Slider }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase

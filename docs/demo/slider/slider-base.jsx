import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-base'
const desc =
  '滑动输入连续或离散数据的单点值或范围值'
const code = `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {
  render() {
    return (
      <Slider defaultValue={30}/>
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

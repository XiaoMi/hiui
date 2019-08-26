import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Carousel from '../../../components/carousel'
const prefix = 'alert-base'
const code = `import React from 'react'
import Carousel from '@hi-ui/hiui/es/carousel'\n
class Demo extends React.Component {
  render () {
    const data = [1, 2, 3, 4, 5, 6, 7, 8]
    return (
      <div style={{width: 400}}>
        <Carousel>
          {
            /*
            {
              data.map((item, index) => {
                return <img style={{height: '100%', display: 'inline-block'}} src={'http://i1.mifile.cn/f/i/hiui/docs/pic_'+item+'.png'} />
              })
            }
            */
          }
          {
            data.map((item) => {
              return <div>{item}</div>
            })
          }
        </Carousel>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Carousel }} prefix={prefix} />
export default DemoBase

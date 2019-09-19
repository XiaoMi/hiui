import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Carousel from '../../../components/carousel'
const prefix = 'carousel-base'
const code = `import React from 'react'
import Carousel from '@hi-ui/hiui/es/carousel'\n
class Demo extends React.Component {
  render () {
    const data = [1, 2, 3, 4, 5, 6, 7, 8]
    return (
      <div style={{width: 800}}>
        <Carousel
          duration={2000}
        >
          {
            data.map((item, index) => {
              return <img src={'http://i1.mifile.cn/f/i/hiui/docs/carousel/pic_'+item+'.png'} style={{height: 300}} />
            })
          }
        </Carousel>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Carousel }} prefix={prefix} />
export default DemoBase

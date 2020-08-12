import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Charts from '../../../components/charts'
const prefix = 'charts-base2'
const desc = ''
const code = `import React from 'react'
import Charts from '@hi-ui/hiui/es/charts'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.options = {
      title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                  {value: 335, name: '直接访问'},
                  {value: 310, name: '邮件营销'},
                  {value: 234, name: '联盟广告'},
                  {value: 135, name: '视频广告'},
                  {value: 1548, name: '搜索引擎'}
              ],
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  }


  }
  render () {
    return (
      <div>
        <Charts option={this.options}/>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ Charts }} prefix={prefix} />
export default DemoBase

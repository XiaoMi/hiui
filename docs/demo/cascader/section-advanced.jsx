import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-advanced'
const rightOptions = ['自定义字段名', '自定义显示', '搜索', '动态加载选项']
const code = [
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          goodsId: '手机',
          goodsName: '手机',
          subGoods: [
            {
              goodsId: '小米',
              goodsName: '小米',
              subGoods: [
                {
                  goodsId: '小米3',
                  goodsName: '小米3'
                },
                {
                  goodsId: '小米4',
                  goodsName: '小米4'
                },
              ]
            },
            {
              goodsId: '红米',
              goodsName: '红米',
              subGoods: [
                {
                  goodsId: '红米3',
                  goodsName: '红米3'
                },
                {
                  goodsId: '红米4',
                  goodsName: '红米4'
                }
              ]
            }
          ]
        },
        {
          goodsId: '电视',
          goodsName: '电视',
          subGoods: [
            {
              goodsId: '小米电视4A',
              goodsName: '小米电视4A'
            },
            {
              goodsId: '小米电视4C',
              goodsName: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        fieldNames={{
          label: 'goodsName',
          value: 'goodsId',
          children: 'subGoods',
        }}
        options={this.state.options}
        style={{width: '240px'}}
      />
    )
  }
}`,
    opt: ['自定义字段名']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        options={this.state.options}
        style={{width: '240px'}}
        displayRender={values => {
          return values.join(' > ')
        }}
      />
    )
  }
}`,
    opt: ['自定义显示']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米1',
                  label: '小米1'
                },
                {
                  value: '小米2',
                  label: '小米2',
                  disabled: true
                },
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
                {
                  value: '小米5',
                  label: '小米5'
                },
                {
                  value: '小米6',
                  label: '小米6'
                },
                {
                  value: '小米7',
                  label: '小米7'
                },
                {
                  value: '小米8',
                  label: '小米8'
                }
              ]
            },
            {
              value: '红米',
              label: '红米',
              disabled: true,
              children: [
                {
                  value: '红米1',
                  label: '红米1'
                },
                {
                  value: '红米2',
                  label: '红米2'
                },
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A 55寸 1GB+4GB大内存 64位四核处理器'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            },
            {
              value: '小米电视4X',
              label: '小米电视4X'
            },
            {
              value: '小米电视4',
              label: '小米电视4'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        noFoundTip="未搜索到相关内容"
        searchable={true}
        options={this.state.options}
        style={{width: '240px'}}
      />
    )
  }
}`,
    opt: ['搜索']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米1',
                  label: '小米1'
                },
                {
                  value: '小米2',
                  label: '小米2',
                  disabled: true
                },
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
                {
                  value: '小米5',
                  label: '小米5'
                },
                {
                  value: '小米6',
                  label: '小米6'
                },
                {
                  value: '小米7',
                  label: '小米7'
                },
                {
                  value: '小米8',
                  label: '小米8'
                }
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米1',
                  label: '红米1'
                },
                {
                  value: '红米2',
                  label: '红米2'
                },
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            },
            {
              value: '小米电视4X',
              label: '小米电视4X'
            },
            {
              value: '小米电视4',
              label: '小米电视4'
            }
          ]
        },
        {
          value: 'mix',
          label: 'Mix',
          children: []
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        options={this.state.options}
        style={{width: '240px'}}
        onActiveItemChange={values=>{
          if(values[0] == 'mix') {
            setTimeout(()=>{
              this.state.options[2].children = [
                {
                  value: 'mix1',
                  label: 'Mix1'
                },{
                  value: 'mix2',
                  label: 'Mix2'
                },{
                  value: 'mix3',
                  label: 'Mix3'
                }
              ]
              this.forceUpdate()
            }, 1000)
          }
        }}
      />
    )
  }
}`,
    opt: ['动态加载选项']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBasic

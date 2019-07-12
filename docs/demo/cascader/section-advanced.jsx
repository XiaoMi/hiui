import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-advanced'
const rightOptions = ['自定义字段名', '自定义显示', '搜索', '动态加载选项']
const code = [
  {
    code: `import React from 'react'
import Cascader from '@hiui/hiui/es/cascader'\n
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
import Cascader from '@hiui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
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
        style={{ width: 240 }}
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
import Cascader from '@hiui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米1',
                  content: '小米1'
                },
                {
                  id: '小米2',
                  content: '小米2',
                  disabled: true
                },
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
                {
                  id: '小米5',
                  content: '小米5'
                },
                {
                  id: '小米6',
                  content: '小米6'
                },
                {
                  id: '小米7',
                  content: '小米7'
                },
                {
                  id: '小米8',
                  content: '小米8'
                }
              ]
            },
            {
              id: '红米',
              content: '红米',
              disabled: true,
              children: [
                {
                  id: '红米1',
                  content: '红米1'
                },
                {
                  id: '红米2',
                  content: '红米2'
                },
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A 55寸 1GB+4GB大内存 64位四核处理器'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            },
            {
              id: '小米电视4X',
              content: '小米电视4X'
            },
            {
              id: '小米电视4',
              content: '小米电视4'
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
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['搜索']
  }, {
    code: `import React from 'react'
import Cascader from '@hiui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米1',
                  content: '小米1'
                },
                {
                  id: '小米2',
                  content: '小米2',
                  disabled: true
                },
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
                {
                  id: '小米5',
                  content: '小米5'
                },
                {
                  id: '小米6',
                  content: '小米6'
                },
                {
                  id: '小米7',
                  content: '小米7'
                },
                {
                  id: '小米8',
                  content: '小米8'
                }
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米1',
                  content: '红米1'
                },
                {
                  id: '红米2',
                  content: '红米2'
                },
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            },
            {
              id: '小米电视4X',
              content: '小米电视4X'
            },
            {
              id: '小米电视4',
              content: '小米电视4'
            }
          ]
        },
        {
          id: 'mix',
          content: 'Mix',
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
        style={{ width: 240 }}
        onActiveItemChange={values=>{
          if(values[0] == 'mix') {
            setTimeout(()=>{
              this.state.options[2].children = [
                {
                  id: 'mix1',
                  content: 'Mix1'
                },{
                  id: 'mix2',
                  content: 'Mix2'
                },{
                  id: 'mix3',
                  content: 'Mix3'
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

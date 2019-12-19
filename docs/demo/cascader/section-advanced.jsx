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
        data={this.state.options}
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
        data={this.state.options}
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
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
    {
        "id":1,

        "children":[
            {
                "id":195,

                "children":[
                    {
                        "id":619,

                        "children":[
                            {
                                "id":621,

                                "children":[
                                    {
                                        "id":899,

                                        "children":null,
                                        "content":"testaaab[899]"
                                    },
                                    {
                                        "id":908,

                                        "children":null,
                                        "content":"F11S[908]"
                                    }
                                ],
                                "content":"POCO手机1[621]"
                            }
                        ],
                        "content":"POCO手机[619]"
                    },
                    {
                        "id":577,

                        "children":[
                            {
                                "id":579,

                                "children":null,
                                "content":"黑鲨手机1[579]"
                            },
                            {
                                "id":656,

                                "children":null,
                                "content":"黑鲨手机 Helo[656]"
                            }
                        ],
                        "content":"黑鲨手机[577]"
                    },
                    {
                        "id":196,

                        "children":[
                            {
                                "id":663,

                                "children":null,
                                "content":"小米Play[663]"
                            },
                            
                            {
                                "id":207,

                                "children":[
                                    {
                                        "id":620,

                                        "children":null,
                                        "content":"小米Max3[620]"
                                    }
                                ],
                                "content":"小米Max[207]"
                            }
                        ],
                        "content":"小米系列[196]"
                    },
                    
                    {
                        "id":925,

                        "children":[
                            {
                                "id":926,

                                "children":null,
                                "content":"大象手机A[926]"
                            },
                            {
                                "id":927,

                                "children":null,
                                "content":"大象手机B[927]"
                            }
                        ],
                        "content":"大象手机[925]"
                    }
                ],
                "content":"手机[195]"
            },
            {
                "id":674,

                "children":[
                    {
                        "id":830,

                        "children":[
                            {
                                "id":831,

                                "children":null,
                                "content":"燃气灶[831]"
                            }
                        ],
                        "content":"厨卫大电[830]"
                    },
                    
                    {
                        "id":930,

                        "children":null,
                        "content":"医疗器械[930]"
                    },
                    
                    
                    {
                        "id":678,

                        "children":[
                            {
                                "id":679,

                                "children":null,
                                "content":"礼品[679]"
                            }
                        ],
                        "content":"钟表/珠宝首饰/礼品[678]"
                    },
                    {
                        "id":845,

                        "children":[
                            {
                                "id":677,

                                "children":null,
                                "content":"电视配件[677]"
                            }
                        ],
                        "content":"手机电视配件[845]"
                    }
                ],
                "content":"生态链[674]"
            }
        ],
        "content":"商品[1]"
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
        data={this.state.options}
        style={{ width: 240 }}
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
        data={this.state.options}
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

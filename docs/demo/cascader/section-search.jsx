import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-search'
const desc = '选项数量较大，不熟悉数据的结构关系情况下，用搜索关键词的方式快速定位'

const code = `import React from 'react'
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
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBasic

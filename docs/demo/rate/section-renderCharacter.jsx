import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
import Icon from '../../../components/Icon'
const prefix = 'rate-advanced'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import Icon from '@hi-ui/hiui/es/icon'
import FormItem from '@hi-ui/hiui/es/form/item'\n

class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 3
    }
    this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  }

  renderCharacter (value, index) {
    if (value<=2) {
      return <Icon name="step-on" style={{color:'#EB5252'}}/>;
    }
    if (value<=3) {
      return <Icon name="star" style={{color:'#1da653'}}/>;
    }
   
    return <Icon name="thumbs-up" style={{color:'#FFCA28'}}/>;
  }

  render() {
    const { value } = this.state
    return (
      <>
        <Rate count={5} allowHalf defaultValue={1} renderCharacter={this.renderCharacter} />  
        <Rate count={5} allowHalf defaultValue={3} renderCharacter={this.renderCharacter} />  
        <Rate count={5} allowHalf defaultValue={3.5} renderCharacter={this.renderCharacter} />  
      </>
    )
  }
}

`
const DemoAdvanced = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate, Icon }}
    prefix={prefix}
  />
)
export default DemoAdvanced

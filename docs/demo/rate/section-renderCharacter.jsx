import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
import Icon from '../../../components/Icon'
import '../style/iconfont.css'
import * as Icons from '../../../components/rate/Icons'
const prefix = 'rate-advanced'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import Icon from '@hi-ui/hiui/es/icon'
import FormItem from '@hi-ui/hiui/es/form/item'\n

class Demo extends React.Component {

  constructor() {
    super() 
  }

  renderCharacter (value, index) {
    const Emojis = [
      Icons.EmojiTwo,
      Icons.EmojiTwo,
      Icons.EmojiThree,
      Icons.EmojiFour,
      Icons.EmojiFive
    ]
    return Emojis[Math.ceil(value)-1]()
   }

  render() {
    return (
      <>
        <Rate count={5}  defaultValue={1} renderCharacter={this.renderCharacter} />  
        <Rate count={5}  defaultValue={3} renderCharacter={this.renderCharacter} />  
        <Rate count={5}  defaultValue={3.5} renderCharacter={this.renderCharacter} />  
      </>
    )
  }
}

`
const DemoAdvanced = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate, Icon, Icons }}
    prefix={prefix}
  />
)
export default DemoAdvanced

import React from 'react'
import {ButtonGroup,Button} from '../src'
import {EditOutlined} from '@hi-ui/icons'

export const Group = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>按钮组</h1>
      <div className="button-basic__wrap" style={{marginBottom:20}}>
        <ButtonGroup style={{marginRight:20}}>
        <Button type="primary">主要按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="primary">主要按钮</Button>
        </ButtonGroup>

        <ButtonGroup>
        <Button>主要按钮</Button>
        <Button>主要按钮</Button>
        <Button>主要按钮</Button>
        </ButtonGroup>
        
      </div>
      <div className="button-basic__wrap" style={{marginBottom:20}}>
        <ButtonGroup style={{marginRight:20}}>
        <Button type="primary" icon={<EditOutlined/>}/>
        <Button type="primary" icon={<EditOutlined/>}/>
        <Button type="primary" icon={<EditOutlined/>}/>
        </ButtonGroup>

        <ButtonGroup>
        <Button icon={<EditOutlined/>}/>
        <Button icon={<EditOutlined/>}/>
        <Button icon={<EditOutlined/>}/>
        </ButtonGroup>
        
      </div>

      <div className="button-basic__wrap" style={{marginBottom:20}}>
        <ButtonGroup style={{marginRight:20}}>
        <Button type="primary">按钮</Button>
        <Button type="primary" icon={<EditOutlined/>}/>
        </ButtonGroup>

        <ButtonGroup>
        <Button>按钮</Button>
        <Button icon={<EditOutlined/>}/>
        </ButtonGroup>
        
      </div>
    </>
  )
}

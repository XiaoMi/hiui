import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Icon from '../../../components/icon'
import Input from '../../../components/input'
import Tooltip from '../../../components/tooltip'
const prefix = 'tag-group'
const desc = '以标签为信息实体进行编辑操作，如品类、频道等管理'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import Icon from '@hi-ui/hiui/es/icon'
import Input from '@hi-ui/hiui/es/input'
import Tootip from '@hi-ui/hiui/es/tootip'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      tags: ['电视', '智能', '笔记本', '手机'],
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
      hoverIndex: -1
    }
  }
  handleClose (removedTag) {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  showInput () {
    this.setState({
      inputVisible: true
    }, () => {
      this.input.focus()
    })
  }

  handleInputChange (e) {
    this.setState({
      inputValue: e.target.value
    })
  }

  saveInputRef (input) {
    this.input = input;
  };

  handleEditInputChange (e) {
    this.setState({ editInputValue: e.target.value });
  };

  handleInputConfirm () {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    });
  }

  handleEditInputConfirm (e) {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      if (editInputValue === '') {
        newTags.splice(editInputIndex, 1)
      } else {
        newTags[editInputIndex] = editInputValue;
      }
      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
        hoverIndex: -1
      };
    });
  };

  render () {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue, hoverIndex } = this.state
    return (
      <div>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <input
                style={{ marginLeft: 4, borderRadius: 11, border: '1px solid rgba(66,132,245,1)', outline: 'none', padding: '2px 8px', fontSize: 12 }}
                ref={(node) => this.editInput = node}
                key={tag}
                size="small"
                value={editInputValue}
                onChange={(e) => this.handleEditInputChange(e)}
                onBlur={(e) => this.handleEditInputConfirm(e)}
                onKeyDown={(e) => {
                  if (event.keyCode == 13) {
                    this.handleEditInputConfirm(e)
                  }
                }}
              />
            );
          }
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              type="tag-group"
              key={tag}
              closable={index !== 1}
              onClose={(e) => this.handleClose(tag)}
              style={{ borderColor: hoverIndex === index ? '#4284F5' : '#E6E7E8' }}
            >
              <span
                onDoubleClick={e => {
                  this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                    this.editInput.focus();
                  });
                  e.preventDefault();
                }}
                onMouseEnter={e => {
                  this.setState({
                    hoverIndex: index
                  })
                }}
                onMouseLeave={e => {
                  this.setState({
                    hoverIndex: -1
                  })
                }}
              >
                {isLongTag ? tag.slice(0, 20) + '...' : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
              tagElem
            );
        })}
        {inputVisible && (
          <input
            ref={(node) => this.saveInputRef(node)}
            type="text"
            size="small"
            value={inputValue}
            onChange={(e) => this.handleInputChange(e)}
            onBlur={(e) => this.handleInputConfirm(e)}
            style={{ marginLeft: 4, borderRadius: 11, border: '1px solid rgba(66,132,245,1)', outline: 'none', padding: '2px 8px', fontSize: 12 }}
            onKeyDown={(e) => {
              if (event.keyCode == 13) {
                this.handleInputConfirm(e)
              }
            }}
          />
        )}
        {
          !inputVisible && <span style={{ width: 50, borderRadius: 11, border: '1px dashed rgba(230,231,232,1)', display: 'inline-block', lineHeight: '18px', textAlign: 'center', marginLeft: 4, boxSizing: 'border-box', cursor: 'pointer',fontSize:12 }} onClick={() => this.showInput()}>
            <Icon name="plus" />
          </span>
        }
      </div>
    )
  }
}`
const Demo = () => (
  <DocViewer code={code} scope={{ Tag, Icon, Input, Tooltip }} desc={desc} prefix={prefix} />
)
export default Demo

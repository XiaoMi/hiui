/* global localStorage, HTMLElement */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import Prism from 'prismjs'
import Demo from './parse2demo'
import './github-markdown.scss'

class Markdown extends Component {
  constructor (props) {
    super(props)
    this.components = new Map()

    this.renderer = new marked.Renderer()
    this.renderer.table = (header, body) => {
      return `<table class="grid"><thead>${header}</thead><tbody>${body}</tbody></table>`
    }
  }
  componentDidMount () {
    this.renderDOM()
  }

  componentDidUpdate () {
    this.renderDOM()
    // Prism.highlightAll()
  }

  renderDOM () {
    for (const [id, component] of this.components) {
      const div = document.getElementById(id)

      if (div instanceof HTMLElement) {
        ReactDOM.render(component, div)
      }
    }
  }

  render () {
    let document = this.document(localStorage.getItem('HIUI_LANGUAGE') || 'zh-CN')
    if (typeof document === 'string') {
      this.components.clear()

      document = document.replace(/:::\s?demo\s?([^]+?):::/g, (match, p1, offset) => {
        const id = offset.toString(36)
        const component = React.createElement(Demo, Object.assign({name: this.constructor.name.toLocaleLowerCase()}, this.props), p1)
        this.components.set(id, component)

        return `<div id=${id}></div>`
      })
      marked.setOptions({
        renderer: this.renderer,
        highlight: function (code, lang, callback) {
          // Pb({ lang: lang, format: 'html' }, code, function (err, result) {
          //   callback(err, result.toString());
          // })

          const ht = Prism.highlight(
            code,
            Prism.languages.javascript
          )
          // callback(ht)

          return ht
        }
      })
      const html = marked(document)
      // console.log(document)
      return (
        <div className='markdown-body' dangerouslySetInnerHTML={{__html: html}} />
      )
    } else {
      return <span />
    }
  }
}

export default Markdown

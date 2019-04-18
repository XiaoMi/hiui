import Markdown from '../../../../libs/markdown'

class Button extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/button.md`)
  }
}

export default Button

import Markdown from '../../../libs/markdown'

class Button extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/button.md`)
  }
}

export default Button

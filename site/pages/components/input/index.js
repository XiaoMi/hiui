import Markdown from '../../../../libs/markdown'

class Input extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/input.md`)
  }
}

export default Input

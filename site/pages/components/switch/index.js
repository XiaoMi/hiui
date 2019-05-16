import Markdown from '../../../../libs/markdown'

class Switch extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/switch.md`)
  }
}

export default Switch

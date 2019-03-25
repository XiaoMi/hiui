import Markdown from '../../../../libs/markdown'

class Radio extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/radio.md`)
  }
}

export default Radio

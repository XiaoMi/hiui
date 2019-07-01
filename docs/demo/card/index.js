import Markdown from '../../../libs/markdown'

class Card extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/components/card.md`)
  }
}

export default Card

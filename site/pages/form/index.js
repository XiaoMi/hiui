import Markdown from '../../../libs/markdown'

class Form extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/form.md`)
  }
}

export default Form

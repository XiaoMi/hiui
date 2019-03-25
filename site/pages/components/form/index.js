import Markdown from '../../../../libs/markdown'

class Form extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/form.md`)
  }
}

export default Form

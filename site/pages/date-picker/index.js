import Markdown from '../../../libs/markdown'

class DatePicker extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/date-picker.md`)
  }
}

export default DatePicker

const components = {}
const files = require.context(`../../../docs/zh-CN/components`, false, /.mdx$/)
files.keys().forEach(key => {
  let _key = key.split('/')[1].split('.')[0]
  components[_key] = files(key).default
})
export default {
  documents: {
    'quick-start': require('../../../docs/zh-CN/components/quick-start'),
    template: require('../../../docs/zh-CN/components/template'),
    theme: require('../../../docs/zh-CN/components/theme'),
    i18n: require('../../../docs/zh-CN/components/i18n'),
    changelog: require('../../../docs/zh-CN/components/changelog')
  },
  components: {
    'group-basic': {
      grid: require('../../../docs/zh-CN/components/grid'),
      typography: require('../../../docs/zh-CN/components/typography'),
      button: components['button'],
      icon: require('../../../docs/zh-CN/components/icon')
    },
    'group-navgation': {
      tabs: components['tabs'],
      dropdown: components['dropdown'],
      pagination: components['pagination'],
      stepper: components['stepper'],
      menu: components['menu']
    },
    'group-form': {
      form: components['form'],
      input: components['input'],
      counter: components['counter'],
      select: components['select'],
      cascader: components['cascader'],
      radio: components['radio'],
      checkbox: components['checkbox'],
      'date-picker': components['date-picker'],
      'time-picker': components['time-picker'],
      upload: components['upload'],
      rate: components['rate']
    },
    'group-data': {
      table: components['table'],
      tree: components['tree'],
      collapse: components['collpase'],
      tooltip: components['tooltip'],
      popover: components['popover'],
      progress: components['progress'],
      card: components['card'],
      timeline: components['timeline'],
      transfer: components['transfer'],
      switch: components['switch']
    },
    'group-tips': {
      modal: components['modal'],
      notification: components['notification'],
      alert: components['alert'],
      badge: components['badge'],
      loading: components['loading']
    }
  }
}

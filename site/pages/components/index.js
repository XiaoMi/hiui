export default {
  documents: {
    'quick-start': require('./quick-start'),
    template: require('./template'),
    theme: require('./theme'),
    i18n: require('./i18n'),
    changelog: require('./changelog')
  },
  components: {
    'group-basic': {
      grid: require('./grid'),
      typography: require('./typography'),
      button: require('./button/index.mdx'),
      icon: require('./icon')
      // 'ficon': require('./ficon')
    },
    'group-navgation': {
      tabs: require('./tabs'),
      navMenu: require('./nav-menu'),
      dropdown: require('./dropdown'),
      pagination: require('./pagination'),
      stepper: require('./stepper'),
      menu: require('./menu')
    },
    'group-form': {
      form: require('./form'),
      input: require('./input'),
      counter: require('./counter'),
      select: require('./select'),
      cascader: require('./cascader'),
      radio: require('./radio'),
      checkbox: require('./checkbox'),
      'date-picker': require('./date-picker'),
      'time-picker': require('./time-picker'),
      upload: require('./upload'),
      rate: require('./rate')
    },
    'group-data': {
      table: require('./table'),
      tree: require('./tree'),
      panel: require('./panel'),
      collapse: require('./collapse'),
      tooltip: require('./tooltip'),
      popover: require('./popover'),
      progress: require('./progress'),
      card: require('./card'),
      timeline: require('./timeline'),
      transfer: require('./transfer'),
      switch: require('./switch')
    },
    'group-tips': {
      modal: require('./modal'),
      // 'confirm': require('./confirm'),
      notification: require('./notification'),
      alert: require('./alert'),
      'test-alert': require('./test-alert'),
      badge: require('./badge'),
      loading: require('./loading')
    }
  }
}
// const files = require.context

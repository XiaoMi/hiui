module.exports = {
  misc: {
    components: 'Basic Components'
  },
  datePicker: {
    ok: 'OK',
    placeholder: 'Select Date',
    dateChoose: 'Select Date',
    timeChoose: 'Select Time',
    undefinedType: 'undefined type',
    lastWeek: 'Nearly week',
    lastMonth: 'Nearly month',
    lastThreeMonth: 'Nearly three months',
    lastYear: 'Nearly year',
    month: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    week: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
    placeholders: {
      date: 'Select Date',
      month: 'Select Month',
      year: 'Select Year',
      time: 'Select Time',
      daterange: 'Select Date',
      week: 'Select Week',
      weekrange: 'Select Week'
    },
    weekrange: function (year, week) {
      return year + 'year ' + week + 'week'
    }
  },
  pagination: {
    total: function (total) {
      return 'Total ' + total + ' items'
    },
    item: 'items',
    goto: 'Goto'
  },
  cascader: {
    placeholder: 'Please select',
    noFoundTip: 'Not found'
  },
  select: {
    placeholder: 'Please select',
    noFoundTip: 'Not found'
  },
  upload: {
    buttonText: 'Upload'
  },
  modal: {
    confirmText: 'OK',
    cancelText: 'Cancel'
  }
}

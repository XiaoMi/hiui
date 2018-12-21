const MultipleCheckboxs = {
  multipleRoot: {}
}
const MultipleCheckboxsOpera = {

  add: (name, ref) => {
    if (name) {
      if (!MultipleCheckboxs[name] && ref) {
        const arr = []
        arr.push(ref)
        MultipleCheckboxs[name] = arr
      } else {
        MultipleCheckboxs[name] && MultipleCheckboxs[name].indexOf(ref) < 0 && ref && MultipleCheckboxs[name].push(ref)
      }
    } else {
      throw new Error('name is empty')
    }
  },
  addRoot: (name, ref) => {
    ref && !MultipleCheckboxs.multipleRoot[name] && (MultipleCheckboxs.multipleRoot[name] = ref)
  },
  getRoot: (name) => {
    return MultipleCheckboxs.multipleRoot[name]
  },
  getAll: (name) => {
    return MultipleCheckboxs[name] || []
  }
}
export default MultipleCheckboxsOpera

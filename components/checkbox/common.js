const MultipleCheckboxs = {
  multipleRoot: {}
}
const MultipleCheckboxsOpera = {

  add: (name, ref) => {
    if (!MultipleCheckboxs[name]) {
      const arr = []
      arr.push(ref)
      MultipleCheckboxs[name] = arr
    } else {
      MultipleCheckboxs[name].indexOf(ref) < 0 && ref && MultipleCheckboxs[name].push(ref)
    }
  },
  addRoot: (name, ref) => {
    !MultipleCheckboxs.multipleRoot[name] && (MultipleCheckboxs.multipleRoot[name] = ref)
  },
  getRoot: (name) => {
    return MultipleCheckboxs.multipleRoot[name]
  },
  getAll: (name) => {
    return MultipleCheckboxs[name] || []
  }
}
export default MultipleCheckboxsOpera

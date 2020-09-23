export const FILEDS_INIT = 'FILEDS_INIT'
export const FILEDS_UPDATE = 'FILEDS_UPDATE'
export const FILEDS_UPDATE_VALUE = 'FILEDS_UPDATE_VALUE'
export const FILEDS_REMOVE = 'FILEDS_REMOVE'
export const FILEDS_INIT_LIST = 'FILEDS_INIT_LIST'
export const FILEDS_UPDATE_LIST = 'FILEDS_UPDATE_LIST'
const FormReducer = (state, action) => {
  switch (action.type) {
    case FILEDS_INIT:
      const { fields } = state
      const initfields = fields.filter((item) => {
        return action.payload.field !== item.field
      })
      return Object.assign({}, { ...state }, { fields: initfields.concat(action.payload) })
    case FILEDS_UPDATE:
      return Object.assign({}, { ...state }, { fields: action.payload })
    case FILEDS_REMOVE:
      const _fields = state.fields.filter((item) => {
        return action.payload !== item.field && action.payload !== item.propsField
      })
      return Object.assign({}, { ...state }, { fields: _fields })
    case FILEDS_INIT_LIST:
      const { listNames } = state
      !listNames.includes(action.payload) && listNames.push(action.payload)

      return Object.assign({}, { ...state }, { listNames: listNames })
    case FILEDS_UPDATE_LIST:
      return Object.assign({}, { ...state }, { listValues: action.payload })
    default:
      return state
  }
}
export default FormReducer

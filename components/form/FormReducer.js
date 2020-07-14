export const FILEDS_INIT = 'FILEDS_INIT'
export const FILEDS_UPDATE = 'FILEDS_UPDATE'
export const FILEDS_UPDATE_VALUE = 'FILEDS_UPDATE_VALUE'
export const FILEDS_REMOVE = 'FILEDS_REMOVE'
const FormReducer = (state, action) => {
  switch (action.type) {
    case FILEDS_INIT:
      const { fields } = state
      const initfields = fields.filter(item => {
        return action.payload.field !== item.field
      })
      return Object.assign(
        {},
        { ...state },
        { fields: initfields.concat(action.payload) }
      )
    case FILEDS_UPDATE:
      return Object.assign({}, { ...state }, { fields: action.payload })
    case FILEDS_REMOVE:
      const _fields = state.fields.filter(item => {
        return action.payload !== item.field
      })
      return Object.assign({}, { ...state },{ fields: _fields })
    default:
      return state
  }
}
export default FormReducer

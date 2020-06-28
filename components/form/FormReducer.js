export const FILEDS_INIT = 'FILEDS_INIT'
export const FILEDS_UPDATE = 'FILEDS_UPDATE'
export const FILEDS_UPDATE_VALUE = 'FILEDS_UPDATE_Value'
const FormReducer = (state, action) => {
  switch (action.type) {
    case FILEDS_INIT:
      const { fields } = state
      return Object.assign(
        {},
        { ...state },
        { fields: fields.concat(action.payload) }
      )
    case FILEDS_UPDATE:
      return Object.assign({}, { ...state }, { fields: action.payload })
    default:
      return state
  }
}
export default FormReducer

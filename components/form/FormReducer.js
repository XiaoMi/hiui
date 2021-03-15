import _ from 'lodash'

/* eslint-disable no-case-declarations */
export const FILEDS_INIT = 'FILEDS_INIT'
export const FILEDS_UPDATE = 'FILEDS_UPDATE'
export const FILEDS_UPDATE_VALUE = 'FILEDS_UPDATE_VALUE'
export const FILEDS_REMOVE = 'FILEDS_REMOVE'
export const FILEDS_INIT_LIST = 'FILEDS_INIT_LIST'
export const FILEDS_UPDATE_LIST = 'FILEDS_UPDATE_LIST'
export default class Immutable {
  constructor() {
    this.state = {}
  }

  FormReducer = (state, action) => {
    switch (action.type) {
      case FILEDS_INIT:
        const { fields } = state
        const initfields = [...fields].filter((item) => {
          return action.payload.field !== item.field
        })
        console.log('初始化state', action.payload)
        this.state = Object.assign({}, { ...state }, { fields: initfields.concat(action.payload) })
        console.log('this.state', this.state)
        return this.state
      case FILEDS_UPDATE:
        this.state.fields = [...action.payload]
        return Object.assign({}, { ...state }, { fields: [...action.payload] })
      case FILEDS_REMOVE:
        const _fields = state.fields.filter((item) => {
          return action.payload !== item.field && action.payload !== item.propsField
        })
        this.state = Object.assign({}, { ...state }, { fields: _fields })
        return this.state
      case FILEDS_INIT_LIST:
        const { listNames } = state
        !listNames.includes(action.payload) && listNames.push(action.payload)
        this.state = Object.assign({}, { ...state }, { listNames: listNames })

        return this.state
      case FILEDS_UPDATE_LIST:
        this.state = Object.assign({}, { ...state }, { listValues: action.payload })
        return this.state
      default:
        this.state = state
        return state
    }
  }

  currentStateFields() {
    return _.cloneDeep(this.state.fields)
  }
}

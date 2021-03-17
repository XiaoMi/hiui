import _ from 'lodash'

/* eslint-disable no-case-declarations */
export const FILEDS_INIT = 'FILEDS_INIT'
export const FILEDS_UPDATE = 'FILEDS_UPDATE'
export const FILEDS_UPDATE_VALUE = 'FILEDS_UPDATE_VALUE'
export const FILEDS_REMOVE = 'FILEDS_REMOVE'
export const FILEDS_INIT_LIST = 'FILEDS_INIT_LIST'
export const FILEDS_UPDATE_LIST = 'FILEDS_UPDATE_LIST'
export const FILEDS_REMOVE_LIST = 'FILEDS_REMOVE_LIST'
export const FILEDS_UPDATE_STATE = 'FILEDS_UPDATE_STATE'
export default class Immutable {
  constructor() {
    this.state = {}
    this.SyncState = { fields: [], listNames: [], listValues: {} }
  }

  FormReducer = (state, action) => {
    switch (action.type) {
      case FILEDS_UPDATE_STATE:
        return this.SyncState
      default:
        this.SyncState = state
        return state
    }
  }

  setState(action) {
    const SyncState = this.SyncState
    switch (action.type) {
      case FILEDS_INIT:
        const { fields } = SyncState
        const initfields = [...fields].filter((item) => {
          return action.payload.field !== item.field
        })
        this.SyncState = _.cloneDeep(Object.assign({}, { ...SyncState }, { fields: initfields.concat(action.payload) }))
        return this.SyncState
      case FILEDS_REMOVE:
        const _fields = SyncState.fields.filter((item) => {
          return action.payload !== item.field && action.payload !== item.propsField
        })
        this.SyncState = _.cloneDeep(Object.assign({}, { ...SyncState }, { fields: _fields }))
        return this.SyncState
      case FILEDS_REMOVE_LIST:
        const notIncludesListFields = SyncState.fields.filter((item) => {
          return action.payload !== item.listname
        })
        this.SyncState.fields = notIncludesListFields
        if (this.SyncState.listValues[action.payload]) {
          this.SyncState.listValues[action.payload] = []
        }
        return this.SyncState
      case FILEDS_UPDATE:
        this.SyncState = _.cloneDeep(Object.assign({}, { ...SyncState }, { fields: [...action.payload] }))
        return this.SyncState
      case FILEDS_INIT_LIST:
        const { listNames } = SyncState
        !listNames.includes(action.payload) && listNames.push(action.payload)
        this.SyncState = _.cloneDeep(Object.assign({}, { ...SyncState }, { listNames: listNames }))
        return this.SyncState
      case FILEDS_UPDATE_LIST:
        this.SyncState = _.cloneDeep(Object.assign({}, { ...SyncState }, { listValues: action.payload }))
        return this.SyncState
      default:
        this.SyncState = SyncState
        return SyncState
    }
  }

  currentStateFields() {
    return _.cloneDeep(this.SyncState.fields)
  }

  currentState() {
    return _.cloneDeep(this.SyncState)
  }
}

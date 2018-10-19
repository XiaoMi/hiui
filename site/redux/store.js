import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducer'

const initState = {}
const store = createStore(reducers, initState, compose(applyMiddleware(thunk)))

export default store

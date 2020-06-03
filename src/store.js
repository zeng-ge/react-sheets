import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import sheets from './features/sheets/reducers'
import promiseMiddleware from './utils/promiseMiddleware'

const rootReducer = combineReducers({sheets})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(rootReducer, composeEnhancers(applyMiddleware(promiseMiddleware)));
import { createStore, combineReducers, compose } from 'redux'
import sheets from './features/sheets/reducers'

const rootReducer = combineReducers({sheets})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(rootReducer, composeEnhancers());
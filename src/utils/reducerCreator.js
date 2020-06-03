/***
 * 
 * const initialState = {
    actionA: {}
  }
 * const actonHandlers = {
    actionA(state, {user}) {
      return {...state, user: user}
    }
  }
  export default createReducer(actonHandlers, initialState)
 */
export function createReducer(handlers, initialState) {
  return function(state, action) {
    if (!state) {
      state = initialState
    }
    const type = action.type
    return handlers[type] ? handlers[type](state, action.payload) : state
  }
}
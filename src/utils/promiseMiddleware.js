const getPromiseKey = payload => {
  for(const key in payload) {
    const value = payload[key]
    if(value && value.then) {
      return key
    }
  }
}

export default ({getState, dispatch}) => next => action => {
  const { payload } = action
  const promiseFieldKey = getPromiseKey(payload)
  if(!!promiseFieldKey) {
    const promise = payload[promiseFieldKey]
    promise
      .then(response => {
        payload[promiseFieldKey] = response
        return next(action)
      })
      .catch(error => {
        payload.error = error
        return Promise.reject(error)
      })
    return promise
  } else {
    return next(action)
  }
}
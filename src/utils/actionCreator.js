import _ from 'lodash'
/**
 * 参考redux-actions的createActions并简化，以达到删除redux-actions的目的
 * actionMap的结构：
 * {
 *  actionA: ()=>({})
 *  actionB: (user) => ({user})
 * }
 * actionA()调用的结果为{type: 'actionA', payload: {}}
 * actionB()调用的结果为{type: 'actionB', payload: { user }}
 */

const createAction = function(type, action) {
  const actionProxy = function(...args) {
    let payload = _.isFunction(action) ? action.apply(null, args) : {}
    if (!payload) {
      payload = {}
    }
    if (_.isError(payload)) {
      payload = { error: true }
    }
    return { type, payload }
  }
  actionProxy.toString = () => type
  return actionProxy
}

/***
 * createActions({
    actionA: () => ({}),
    actionB: user => ({user})
  }
 */
export function createActions(actionMap) {
  const actions = {}
  _.forEach(actionMap, (action, type) => {
    actions[type] = createAction(type, action)
  })
  return actions
}

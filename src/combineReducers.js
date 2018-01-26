'use strict'

const combineReducers = (reducerO) =>
  (state = {}, action) =>
    Object.keys(reducerO).reduce(
      (nextState, key) => typeof reducerO[key] === 'function'
        ? ({
          ...nextState,
          [key]:  reducerO[key](state[key], action)
        })
        : nextState,
      {}
    )

export default combineReducers
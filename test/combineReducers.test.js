'use strict'

import combineReducers from '../src/combineReducers'

// some test cases from redux
describe('combineReducers', () => {
  it('returns a composite reducer that maps the state keys to given reducers', () => {
    const reducerO = {
      counter: (state = 0, action) =>
        action.type === 'increment' ? state + 1 : state,
      stack: (state = [], action) =>
        action.type === 'push' ? [...state, action.value] : state
    }
    const reducer = combineReducers(reducerO)
    const initState = {}
    const state1 = reducer(initState, {type: 'increment'})
    expect(state1).toEqual({counter: 1, stack: []})
    const state2 = reducer(state1, {type: 'push', value: 'a'})
    expect(state2).toEqual({counter: 1, stack: ['a']})
  })

  it('ignores all props which are not a function', () => {
    const reducerO = {
      fake: true,
      broken: 'string',
      another: { nested: 'object' },
      stack: (state = []) => state
    }
    const reducer = combineReducers(reducerO)
    const initState = {}
    const state1 = reducer(initState, {type: 'push'})
    // only exists 'stack' prop
    expect(Object.keys(state1)).toEqual(['stack'])
  })


  it('catches error thrown in reducer when initializing and re-throw', () => {
    const reducerO = {
      throwingReducer() {
        throw new Error('Error thrown in reducer')
      }
    }
    const reducer = combineReducers(reducerO)
    expect(() => reducer({})).toThrow(/Error thrown in reducer/)
  })

  it('allows a symbol to be used as an action type', () => {
    const increment = Symbol('INCREMENT')
    const reducerO = {
      counter(state = 0, action) {
        switch (action.type) {
          case increment:
            return state + 1
          default:
            return state
        }
      }
    }
    const reducer = combineReducers(reducerO)
    const initState = {counter: 0}
    expect(reducer(initState, {type: increment})).toEqual({counter: 1})
  })
})


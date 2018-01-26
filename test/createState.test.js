'use strict'

import Rx from 'rxjs'
import createState from '../src/createState'
import createAction from '../src/createAction'

import {
  unknownAction,
  addTodo
} from './helpers/actionCreators'

import {
  todos,
}from './helpers/reducers'

describe('createState', () => {
  it('applies the reducer to the previous state', () => {
    const action$ = createAction()
    const state$ = createState(todos, action$, [])
    let timer = 0
    state$.subscribe(v => {
      timer += 1
      switch (timer) {
        case 1:
          expect(v).toEqual([])
          break
        case 2:
          expect(v).toEqual([])
          break
        case 3:
          expect(v).toEqual([
            {
              id: 1,
              text: 'Hello'
            }
          ])
          break
        case 4:
          expect(v).toEqual([
            {
              id: 1,
              text: 'Hello'
            },
            {
              id: 2,
              text: 'World'
            }
          ])
          break
      }
    })

    action$.next(unknownAction())
    action$.next(addTodo('Hello'))
    action$.next(addTodo('World'))
  })

  it('applies the reducer to the initial state', () => {
    const action$ = createAction()
    const initState = [{
      id: 1,
      text: 'Hello'
    }]
    const state$ = createState(todos, action$, initState)
    let timer = 0
    state$.subscribe(v => {
      timer += 1
      switch (timer) {
        case 1:
          expect(v).toEqual(initState)
          break
        case 2:
          expect(v).toEqual(initState)
          break
        case 3:
          expect(v).toEqual([
            {
              id: 1,
              text: 'Hello'
            },
            {
              id: 2,
              text: 'World'
            }
          ])
          break
      }
    })

    action$.next(unknownAction())
    action$.next(addTodo('World'))
  })

  it('supports multiple subscriptions', () => {
    const action$ = createAction()
    const state$ = createState(todos, action$, [])

    const listenerA = jest.fn()
    const listenerB = jest.fn()

    let A$ = state$.subscribe(listenerA)
    expect(listenerA.mock.calls.length).toBe(1)
    expect(listenerB.mock.calls.length).toBe(0)

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(2)
    expect(listenerB.mock.calls.length).toBe(0)

    let B$ = state$.subscribe(listenerB)
    expect(listenerA.mock.calls.length).toBe(2)
    expect(listenerB.mock.calls.length).toBe(1)

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    A$.unsubscribe()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(3)

    B$.unsubscribe()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(3)

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(3)

    A$ = state$.subscribe(listenerA)
    // received two events: complete and replay
    // https://blog.angularindepth.com/rxjs-how-to-use-refcount-73a0c6619a4e
    expect(listenerA.mock.calls.length).toBe(5)
    expect(listenerB.mock.calls.length).toBe(3)

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(6)
    expect(listenerB.mock.calls.length).toBe(3)

    B$ = state$.subscribe(listenerB)
    expect(listenerA.mock.calls.length).toBe(6)
    expect(listenerB.mock.calls.length).toBe(4)
  })

  it('only removes listener once when unsubscribe is called', () => {
    const action$ = createAction()
    const state$ = createState(todos, action$, [])

    const listenerA = jest.fn()
    const listenerB = jest.fn()

    const A$ = state$.subscribe(listenerA)
    state$.subscribe(listenerB)
    expect(listenerA.mock.calls.length).toBe(1)
    expect(listenerB.mock.calls.length).toBe(1)

    A$.unsubscribe()
    A$.unsubscribe()

    action$.next(unknownAction())
    expect(listenerA.mock.calls.length).toBe(1)
    expect(listenerB.mock.calls.length).toBe(2)
  })

  it('only removes relevant listener when unsubscribe is called', () => {
    const action$ = createAction()
    const state$ = createState(todos, action$, [])

    const listener = jest.fn()
    const A$ = state$.subscribe(listener)
    const B$ = state$.subscribe(listener)
    expect(listener.mock.calls.length).toBe(2)

    B$.unsubscribe()
    B$.unsubscribe()

    action$.next(unknownAction())
    expect(listener.mock.calls.length).toBe(3)
  })

  it('provides an up-to-date state when a subscriber is notified', () => {
    const action$ = createAction()
    const state$ = createState(todos, action$, [])
    let timer = 0
    state$.subscribe(v => {
      timer += 1
      switch (timer) {
        case 1:
          expect(v).toEqual([])
          break
        case 2:
          expect(v).toEqual([{
            id: 1,
            text: 'Hello'
          }])
      }
    })
    action$.next(addTodo('Hello'))
  })
})

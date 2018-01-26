'use strict'

import Rx from 'rxjs'
import createAction from '../src/createAction'

describe('createAction', () => {
  it('always returns new Subject', () => {
    const sub$ = new Rx.Subject()
    expect(createAction()).toEqual(sub$)
    expect(createAction('whatever')).toEqual(sub$)
  })
})

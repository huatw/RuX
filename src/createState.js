'use strict'

const createState = (reducer, action$, initialState) =>
  action$
    .startWith(initialState)
    .scan(reducer)
    .publishReplay(1)
    .refCount()


export default createState
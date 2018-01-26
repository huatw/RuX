'use strict'

import Rx from 'rxjs'
import mergeLoader from '../src/mergeLoader'

describe.only('mergeLoader', () => {
  it('get loader when action triggers', (done) => {
    const ajax = (v) => Promise.resolve(v)
    const action$ = new Rx.Subject()
    const loaderState = {isLoading: true}
    mergeLoader(action$, ajax, loaderState).subscribe((v) => {
      expect(v).toBe(loaderState)
      done()
    })
    action$.next('whatever')
  })

  it('get data after loader state', (done) => {
    const ajax = (v) => Promise.resolve(v)
    const action$ = new Rx.Subject()
    const loaderState = {isLoading: true}
    const data = 123
    let isFirst = true
    mergeLoader(action$, ajax, loaderState).subscribe((v) => {
      if (isFirst) {
        expect(v).toBe(loaderState)
        isFirst = false
      }
      else {
        expect(v).toBe(data)
        isFirst = true
      }
      done()
    })
    action$.next(data)
  })

})

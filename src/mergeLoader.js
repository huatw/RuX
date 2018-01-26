'use strict'

import Rx from 'rxjs'

const mergeLoader = (action$, ajax, loaderState = {isLoading: true}) =>
  Rx.Observable.merge(
    action$.mapTo(loaderState),
    action$.mergeMap(ajax)
  )

export default mergeLoader
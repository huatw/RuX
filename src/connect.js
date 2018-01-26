'use strict'

import {Component} from 'react'
import PropTypes from 'prop-types'

function connect (selector = state => state, actionSubjects = {}) {
  const actions = Object.keys(actionSubjects)
    .reduce(
      (acc, key) => ({ ...acc, [key]: arg => actionSubjects[key].next(arg)}),
      {}
    )

  return (WrappedComponent) =>
    class Connect extends Component {
      static contextTypes = {
        state$: PropTypes.object.isRequired
      }

      componentWillMount () {
        this.subscription = this.context.state$
          .map(selector)
          .subscribe((state) => this.setState(state))
      }

      componentWillUnmount () {
        this.subscription.unsubscribe()
      }

      render() {
        return (
          <WrappedComponent {...this.state} {...this.props} {...actions}/>
        )
      }
    }
}

export default connect
'use strict'

import {Component} from 'react'
import PropTypes from 'prop-types'

class Provider extends Component {
  static propTypes = {
    state$: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    state$: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { state$: this.props.state$ }
  }

  render() {
    return this.props.children
  }
}

export default Provider
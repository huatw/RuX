'use strict'

import {
  ADD_TODO,
  UNKNOWN_ACTION
} from './actionTypes'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function unknownAction() {
  return {
    type: UNKNOWN_ACTION
  }
}
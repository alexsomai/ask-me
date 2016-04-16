import * as types from '../constants/ActionTypes'
import { CALL_API } from '../middleware/api'

function createSession(creds) {
  return {
    [CALL_API]: {
      types: [ types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_FAILURE ],
      endpoint: '/sessions/create',
      config: {
          method: 'POST',
          headers: { 'Content-Type':'application/x-www-form-urlencoded' },
          body: `username=${creds.username}&password=${creds.password}`
      }
    }
  }
}

export function loginUser(creds) {
  return (dispatch) => {
    return dispatch(createSession(creds))
  }
}

// Fetches all the questions from the given room
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchQuestions(room) {
  return {
    room,
    [CALL_API]: {
      types: [ types.QUESTIONS_REQUEST, types.QUESTIONS_SUCCESS, types.QUESTIONS_FAILURE ],
      endpoint: `/questions/${room}`
    }
  }
}

// Fetches all the questions from the given room unless they are cached.
// Relies on Redux Thunk middleware.
export function loadQuestions(room) {
  return (dispatch, getState) => {
    const questions = getState().questions[room]
    if (questions) {
      return null
    }

    return dispatch(fetchQuestions(room))
  }
}

export function addQuestion(question) {
  return { type: types.ADD_QUESTION, payload: question }
}

export function voteQuestion(question) {
  return { type: types.VOTE_QUESTION, payload: question }
}
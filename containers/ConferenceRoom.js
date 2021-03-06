import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as QuestionActions from '../actions'
import { subscribe } from '../middleware/socket-util'
import { API_ROOT } from '../middleware/api'

import QuestionTextInput from '../components/QuestionTextInput'
import MainSection from '../components/MainSection'
import BackToTop from '../components/BackToTop'

function loadData(props) {
  const { actions, room } = props
  actions.loadQuestions(room)
}

class ConferenceRoom extends Component {
  constructor(props) {
    super(props)
    this.submitQuestion = this.submitQuestion.bind(this)
    this.voteQuestion = this.voteQuestion.bind(this)
    this.doneQuestion = this.doneQuestion.bind(this)
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentDidMount() {
    subscribe(this.props)
  }

  submitQuestion(text) {
    if(!text) {
      return
    }

    const { room, actions } = this.props
    actions.addQuestionRequest(room, text)
  }

  voteQuestion(question) {
    const { room, actions } = this.props
    const { id, votes } = question
    actions.voteQuestionRequest(room, id, votes)
  }

  doneQuestion(question) {
    const { room, actions } = this.props
    const { id, done } = question
    actions.doneQuestionRequest(room, id, done)
  }

  render() {
    const {
      questions, userinfo, room, status,
      submitting, voting, markingDone
    } = this.props
    return (
      <div>
        <MainSection
          questions={questions[room]}
          userinfo={userinfo}
          isFetching={status.isFetching}
          errorMessage={status.errorMessage}
          isSubmitting={submitting.isFetching}
          submittingErrorMessage={submitting.errorMessage}
          isUpdating={voting.isFetching || markingDone.isFetching}
          updatingErrorMessage={voting.errorMessage || markingDone.errorMessage}
          onVoteQuestion={this.voteQuestion}
          onDoneQuestion={this.doneQuestion}
          loadingLabel={`Loading questions for '${room}' conference room...`}
          emptyRoomLabel={`Conference room '${room}' has no questions yet`} />
        <QuestionTextInput
          onSubmit={this.submitQuestion}
          isSubmitting={submitting.isFetching} />
        <BackToTop />
      </div>
    )
  }
}

ConferenceRoom.propTypes = {
  questions: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  submitting: PropTypes.object.isRequired,
  voting: PropTypes.object.isRequired,
  markingDone: PropTypes.object.isRequired,
  room: PropTypes.string.isRequired
}

ConferenceRoom.defaultProps = {
  status: { isFetching: false },
  submitting: { isFetching: false },
  voting: { isFetching: false },
  markingDone: { isFetching: false }
}

function mapStateToProps(state, ownProps) {
  const room = ownProps.location.pathname.replace('/', '')
  return {
    questions: state.questions,
    status: state.status.questions[room],
    submitting: state.status.submitting[room],
    voting: state.status.voting[room],
    markingDone: state.status.markingDone[room],
    room: room,
    userinfo: state.userinfo.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(QuestionActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceRoom)

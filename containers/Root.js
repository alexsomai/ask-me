import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import ConferenceRoom from './ConferenceRoom.js'
import DevTools from './DevTools'

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <div>
          <DevTools />
          <ConferenceRoom />
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

import React from 'react'
import PusherStore from '../../stores/PusherStore'
import BuildState from '../icons/BuildState'

class BuildsDropdownList extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      builds: React.PropTypes.shape({
      })
    })
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent)
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent)
  }

  render() {
    console.log(this.props.viewer)
    if (this.props.viewer.builds.length > 0) {
      return (
        <span>Builds!</span>
      )
    } else {
      return (
        <span>You have no builds yet</span>
      )
    }
  }

  handlePusherWebsocketEvent(payload) {
    this.props.relay.forceFetch()
  }
}

export default BuildsDropdownList

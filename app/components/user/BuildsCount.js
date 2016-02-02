import React from 'react';
import PusherStore from '../../stores/PusherStore';

class BuildsCount extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      scheduledBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      runningBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    })
  };

  state = {
    scheduledBuildsCount: this.props.viewer.scheduledBuilds.count,
    runningBuildsCount: this.props.viewer.runningBuilds.count
  };

  componentDidMount() {
    PusherStore.on("user_stats:change", this._onStoreChange.bind(this));
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this._onStoreChange.bind(this));
  }

  render() {
    return (
      <span>{this.state.runningBuildsCount + this.state.scheduledBuildsCount}</span>
    );
  }

  _onStoreChange(payload) {
    this.setState({ scheduledBuildsCount: payload.scheduledBuildsCount, runningBuildsCount: payload.runningBuildsCount });
  }
}

export default BuildsCount;

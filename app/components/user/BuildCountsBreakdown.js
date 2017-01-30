import React from 'react';
import classNames from 'classnames';

import PusherStore from '../../stores/PusherStore';
import StateSwitcher from '../build/StateSwitcher';

class BuildCountsBreakdown extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      builds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      scheduledBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      runningBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    }),
    state: React.PropTypes.string
  };

  state = {
    buildsCount: this.props.viewer.builds.count,
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
      <StateSwitcher
        state={this.props.state}
        buildsCount={this.state.buildsCount}
        runningBuildsCount={this.state.runningBuildsCount}
        scheduledBuildsCount={this.state.scheduledBuildsCount}
      />
    );
  }

  _onStoreChange(payload) {
    this.setState({
      buildsCount: payload.buildsCount,
      scheduledBuildsCount: payload.scheduledBuildsCount,
      runningBuildsCount: payload.runningBuildsCount
    });
  }
}

export default BuildCountsBreakdown;

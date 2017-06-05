import React from 'react';
import PropTypes from 'prop-types';

import PusherStore from '../../stores/PusherStore';
import StateSwitcher from '../build/StateSwitcher';

export default class BuildCountsBreakdown extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.shape({
      builds: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      scheduledBuilds: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      runningBuilds: PropTypes.shape({
        count: PropTypes.number.isRequired
      })
    }),
    state: PropTypes.string
  };

  state = {
    buildsCount: this.props.viewer.builds.count,
    scheduledBuildsCount: this.props.viewer.scheduledBuilds.count,
    runningBuildsCount: this.props.viewer.runningBuilds.count
  };

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handleStoreChange);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handleStoreChange);
  }

  render() {
    return (
      <StateSwitcher
        path="/builds"
        state={this.props.state}
        buildsCount={this.state.buildsCount}
        runningBuildsCount={this.state.runningBuildsCount}
        scheduledBuildsCount={this.state.scheduledBuildsCount}
      />
    );
  }

  handleStoreChange = (payload) => {
    this.setState({
      buildsCount: payload.buildsCount,
      scheduledBuildsCount: payload.scheduledBuildsCount,
      runningBuildsCount: payload.runningBuildsCount
    });
  }
}

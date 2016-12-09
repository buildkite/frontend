import React from 'react';

import PusherStore from '../../stores/PusherStore';

import { formatNumber } from '../../lib/number';

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
    })
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
      <div className="flex">
        <div className="rounded-left border-left border-top border-bottom border-gray flex items-center" style={{ lineHeight: "1.8" }}>
          <a href="/builds" className="py1 px3 dark-gray hover-black">{formatNumber(this.state.buildsCount)} Builds</a>
        </div>
        <div className="border-left border-top border-bottom border-gray flex items-center">
          <a href="/builds?state=running" className="py1 px3 dark-gray hover-black">{formatNumber(this.state.runningBuildsCount)} Running</a>
        </div>
        <div className="rounded-right border border-gray flex items-center">
          <a href="/builds?state=scheduled" className="py1 px3 dark-gray hover-black">{formatNumber(this.state.scheduledBuildsCount)} Scheduled</a>
        </div>
      </div>
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

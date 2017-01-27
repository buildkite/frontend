import React from 'react';
import classNames from 'classnames';

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

  renderLink(label, state, count) {
    let url = state ? `/builds?state=${state}` : "/builds";
    let classes = classNames("py1 px3 hover-black hover-bg-silver text-decoration-none", {
      "dark-gray": (count == 0),
      "black": (count > 0),
    });

    return (
      <a href={url} className={classes} style={{ lineHeight: "1.8" }}>{formatNumber(count)} {label}</a>
    )
  }

  render() {
    return (
      <div className="flex">
        <div className="rounded-left border-left border-top border-bottom border-gray flex items-center">
          {this.renderLink("Builds", null, this.state.buildsCount)}
        </div>
        <div className="border-left border-top border-bottom border-gray flex items-center">
          {this.renderLink("Running", "running", this.state.runningBuildsCount)}
        </div>
        <div className="rounded-right border border-gray flex items-center">
          {this.renderLink("Scheduled", "scheduled", this.state.scheduledBuildsCount)}
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

import React from 'react';
import PusherStore from '../../stores/PusherStore';
import ButtonGroup from '../shared/ButtonGroup';

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
      <ButtonGroup>
        <a href="/builds" className="btn">{this.state.buildsCount} Builds</a>
        <a href="/builds?state=running" className="btn">{this.state.runningBuildsCount} Running</a>
        <a href="/builds?state=scheduled" className="btn">{this.state.scheduledBuildsCount} Scheduled</a>
      </ButtonGroup>
    );
  }

  _onStoreChange(payload) {
    this.setState({ buildsCount: payload.buildsCount,
                    scheduledBuildsCount: payload.scheduledBuildsCount,
                    runningBuildsCount: payload.runningBuildsCount });
  }
}

export default BuildCountsBreakdown;

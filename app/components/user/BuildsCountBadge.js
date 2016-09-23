import React from 'react';
import PusherStore from '../../stores/PusherStore';
import Badge from './../shared/Badge';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class BuildsCountBadge extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      scheduledBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      runningBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    }),
    className: React.PropTypes.string
  };

  state = {
    scheduledBuildsCount: this.props.viewer.scheduledBuilds ? this.props.viewer.scheduledBuilds.count : 0,
    runningBuildsCount: this.props.viewer.runningBuilds ? this.props.viewer.runningBuilds.count : 0
  };

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  handleStoreChange = (payload) => {
    this.setState({
      scheduledBuildsCount: payload.scheduledBuildsCount,
      runningBuildsCount: payload.runningBuildsCount
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.viewer.scheduledBuilds || nextProps.viewer.runningBuilds) {
      this.setState({
        scheduledBuildsCount: nextProps.viewer.scheduledBuilds.count,
        runningBuildsCount: nextProps.viewer.runningBuilds.count
      });
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const {
      scheduledBuildsCount: lastScheduledBuildsCount,
      runningBuildsCount: lastRunningBuildsCount
    } = this.state;

    const {
      scheduledBuildsCount: newScheduledBuildsCount,
      runningBuildsCount: newRunningBuildsCount
    } = nextState;
    const {
      scheduledBuilds: newScheduledBuilds,
      runningBuilds: newRunningBuilds
    } = nextProps.viewer;

    return (
      (newScheduledBuilds && newScheduledBuilds.count !== lastScheduledBuildsCount)
      || (newScheduledBuildsCount !== lastScheduledBuildsCount)
      || (newRunningBuilds && newRunningBuilds.count !== lastRunningBuildsCount)
      || (newRunningBuildsCount !== lastRunningBuildsCount)
    );
  };

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="transition-appear-pop" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        {this.renderBadge()}
      </ReactCSSTransitionGroup>
    );
  }

  renderBadge() {
    const count = this.state.runningBuildsCount + this.state.scheduledBuildsCount;

    if (count > 0) {
      return (
        <Badge key="badge" className={this.props.className}>{count}</Badge>
      );
    }
  }

  handlePusherWebsocketEvent = (payload) => {
    this.setState({ scheduledBuildsCount: payload.scheduledBuildsCount, runningBuildsCount: payload.runningBuildsCount });
  };
}

export default BuildsCountBadge;
